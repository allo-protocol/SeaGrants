"use client";
import React, { useEffect, useState } from "react";
import { MicroGrantsStrategy, Registry } from "@allo-team/allo-v2-sdk/";

import { getIPFSClient } from "@/services/ipfs";
import {
  EProgressStatus,
  ETarget,
  TNewApplication,
  TProgressStep,
} from "@/app/types";
import { sendTransaction } from "@wagmi/core";
import { getChain, wagmiConfigData } from "@/services/wagmi";
import { decodeEventLog } from "viem";
import { MicroGrantsABI } from "@/abi/Microgrants";
import {
  ethereumHashRegExp,
  pollUntilDataIsIndexed,
  pollUntilMetadataIsAvailable,
} from "@/utils/common";
import { checkIfRecipientIsIndexedQuery } from "@/utils/query";
import { useAccount } from "wagmi";
import {
  TransactionData,
  ZERO_ADDRESS,
} from "@allo-team/allo-v2-sdk/dist/Common/types";
import { getProfileById } from "@/utils/request";

export interface IApplicationContextProps {
  steps: TProgressStep[];
  createApplication: (
    data: TNewApplication,
    chain: number,
    poolId: number,
  ) => Promise<string>;
}

const initialSteps: TProgressStep[] = [
  {
    content: "Using profile ",
    target: "",
    href: "",
    status: EProgressStatus.IN_PROGRESS,
  },
  {
    content: "Saving your application to ",
    target: ETarget.IPFS,
    href: "",
    status: EProgressStatus.NOT_STARTED,
  },
  {
    content: "Registering your application on ",
    target: ETarget.POOL,
    href: "#",
    status: EProgressStatus.NOT_STARTED,
  },
  {
    content: "Indexing your application on ",
    target: ETarget.SPEC,
    href: "",
    status: EProgressStatus.NOT_STARTED,
  },
  {
    content: "Indexing application metadata on ",
    target: ETarget.IPFS,
    href: "",
    status: EProgressStatus.NOT_STARTED,
  },
];

export const ApplicationContext = React.createContext<IApplicationContextProps>(
  {
    steps: [],
    createApplication: async () => {
      return "";
    },
  },
);

export const ApplicationContextProvider = (props: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [steps, setSteps] = useState<TProgressStep[]>(initialSteps);
  const { address } = useAccount();

  const updateStepTarget = (index: number, target: string) => {
    const newSteps = [...steps];
    newSteps[index].target = target;
    setSteps(newSteps);
  };

  const updateStepStatus = (index: number, flag: boolean) => {
    const newSteps = [...steps];
    if (flag) {
      newSteps[index].status = EProgressStatus.IS_SUCCESS;
    } else {
      newSteps[index].status = EProgressStatus.IS_ERROR;
    }

    if (steps.length > index + 1)
      newSteps[index + 1].status = EProgressStatus.IN_PROGRESS;

    setSteps(newSteps);
    return newSteps;
  };

  const updateStepHref = (index: number, href: string) => {
    const newSteps = [...steps];
    newSteps[index].href = href;
    setSteps(newSteps);
  };

  const updateStepContent = (index: number, content: string) => {
    const newSteps = [...steps];
    newSteps[index].content = content;
    setSteps(newSteps);
  };

  const createApplication = async (
    data: TNewApplication,
    chain: number,
    poolId: number,
  ): Promise<string> => {
    const chainInfo = getChain(chain);

    // if step target is CHAIN update target to chainInfo.name
    setSteps((prevSteps) => {
      const newSteps = [...prevSteps];
      newSteps.map((step) => {
        if (step.target === ETarget.CHAIN) {
          step.target = chainInfo.name;
        }
      });
      return newSteps;
    });

    let stepIndex = 0;

    let profileContent = steps[0].content;
    let profileTarget = steps[0].target;

    // if data.profileName set a new step at index 0 of steps
    if (data.profileName) {
      profileContent = "Creating new profile ";
      profileTarget = data.profileName;
    } else {
      const profile = await getProfileById({
        chainId: chain.toString(),
        profileId: data.profileId!.toLowerCase(),
      });

      profileTarget = profile.name;
    }

    updateStepContent(stepIndex, profileContent);
    updateStepTarget(stepIndex, profileTarget);
    updateStepHref(stepIndex, "");

    let profileId = data.profileId;
    const registry = new Registry({ chain: chain });

    // 1. if profileName is set, create profile
    if (data.profileName && address) {
      const randomNumber = Math.floor(Math.random() * 10000000000);

      const txCreateProfile: TransactionData = await registry.createProfile({
        nonce: randomNumber,
        name: data.profileName,
        metadata: {
          protocol: BigInt(0),
          pointer: "",
        },
        owner: address,
        members: [],
      });

      try {
        const tx = await sendTransaction({
          to: txCreateProfile.to as string,
          data: txCreateProfile.data,
          value: BigInt(txCreateProfile.value),
        });

        const receipt =
          await wagmiConfigData.publicClient.waitForTransactionReceipt({
            hash: tx.hash,
          });

        const { logs } = receipt;
        profileId = logs[0].topics[1] || "0x";

        if (profileId === "0x") {
          throw new Error("Profile creation failed");
        }

        updateStepHref(
          stepIndex,
          `${chainInfo.blockExplorers.default.url}/tx/` + tx.hash,
        );
      } catch (e) {
        updateStepStatus(stepIndex, false);
        console.log("Creating Profile", e);
      }

      await new Promise((resolve) => setTimeout(resolve, 10000));
    }

    updateStepStatus(stepIndex, true);

    stepIndex++;

    // 2. Save metadata to IPFS
    const ipfsClient = getIPFSClient();

    const metadata = {
      name: data.name,
      website: data.website,
      description: data.description,
      email: data.email,
      base64Image: data.base64Image,
    };

    let imagePointer;
    let pointer;

    try {
      if (metadata.base64Image.includes("base64")) {
        imagePointer = await ipfsClient.pinJSON({
          data: metadata.base64Image,
        });
        metadata.base64Image = imagePointer.IpfsHash;
      }

      pointer = await ipfsClient.pinJSON(metadata);
      updateStepHref(stepIndex, "https://ipfs.io/ipfs/" + pointer.IpfsHash);
      updateStepStatus(stepIndex, true);
    } catch (e) {
      console.log("IPFS", e);
      updateStepStatus(stepIndex, false);
    }

    stepIndex++;

    // 3. Register application to pool
    let recipientId;
    const strategy = new MicroGrantsStrategy({ chain, poolId });
    let anchorAddress: string = ZERO_ADDRESS;

    if (ethereumHashRegExp.test(profileId || "")) {
      anchorAddress = (
        await getProfileById({
          chainId: chain.toString(),
          profileId: profileId!.toLowerCase(),
        })
      ).anchor;
    }

    const registerRecipientData = strategy.getRegisterRecipientData({
      registryAnchor: anchorAddress as `0x${string}`,
      recipientAddress: data.recipientAddress as `0x${string}`,
      requestedAmount: data.requestedAmount,
      metadata: {
        protocol: BigInt(1),
        pointer: pointer.IpfsHash,
      },
    });

    try {
      const tx = await sendTransaction({
        to: registerRecipientData.to as string,
        data: registerRecipientData.data,
        value: BigInt(registerRecipientData.value),
      });

      const reciept =
        await wagmiConfigData.publicClient.waitForTransactionReceipt({
          hash: tx.hash,
        });

      const { logs } = reciept;
      const decodedLogs = logs.map((log) =>
        decodeEventLog({ ...log, abi: MicroGrantsABI }),
      );

      recipientId = (decodedLogs[0].args as any)["recipientId"].toLowerCase();

      updateStepTarget(
        stepIndex,
        `${chainInfo.name} at ${tx.hash.slice(0, 6)}`,
      );

      updateStepHref(
        stepIndex,
        `${chainInfo.blockExplorers.default.url}/tx/` + tx.hash,
      );

      updateStepStatus(stepIndex, true);
    } catch (e) {
      console.log("Registering Application", e);
      updateStepStatus(stepIndex, false);
    }

    stepIndex++;

    // 4. Poll indexer for recipientId
    const pollingData: any = {
      chainId: chain,
      poolId: poolId,
      recipientId: recipientId.toLowerCase(),
    };
    const pollingResult: boolean = await pollUntilDataIsIndexed(
      checkIfRecipientIsIndexedQuery,
      pollingData,
      "microGrantRecipient",
    );

    if (pollingResult) {
      updateStepStatus(stepIndex, true);
    } else {
      console.log("Polling ERROR");
      updateStepStatus(stepIndex, false);
    }

    stepIndex++;

    // 5. Index Metadata

    console.log("pointer.IpfsHash", pointer.IpfsHash);
    const pollingMetadataResult = await pollUntilMetadataIsAvailable(
      pointer.IpfsHash,
    );

    console.log("pollingMetadataResult", pollingMetadataResult);

    if (pollingMetadataResult) {
      updateStepStatus(stepIndex, true);
    } else {
      console.log("Polling ERROR");
      updateStepStatus(stepIndex, false);
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));

    return recipientId;
  };

  return (
    <ApplicationContext.Provider
      value={{
        steps: steps,
        createApplication: createApplication,
      }}
    >
      {props.children}
    </ApplicationContext.Provider>
  );
};
