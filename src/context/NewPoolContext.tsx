"use client";
import React, { useState } from "react";
import { MicroGrantsStrategy, Allo, Registry } from "@allo-team/allo-v2-sdk/";

import { getIPFSClient } from "@/services/ipfs";
import {
  EProgressStatus,
  ETarget,
  TNewPool,
  TNewPoolResponse,
  TProgressStep,
} from "@/app/types";
import {
  sendTransaction,
  getWalletClient,
  waitForTransaction,
} from "@wagmi/core";
import { getChain, wagmiConfigData } from "@/services/wagmi";
import {
  pollUntilDataIsIndexed,
  pollUntilMetadataIsAvailable,
} from "@/utils/common";
import { checkIfPoolIsIndexedQuery } from "@/utils/query";
import { useAccount } from "wagmi";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";

export interface INewPoolContextProps {
  steps: TProgressStep[];
  createNewPool: (data: TNewPool, chain: number) => Promise<TNewPoolResponse>;
}

const initialSteps: TProgressStep[] = [
  {
    content: "Saving your application to ",
    target: ETarget.IPFS,
    href: "",
    status: EProgressStatus.NOT_STARTED,
  },
  {
    content: "Deploying new pool strategy to ",
    target: ETarget.CHAIN,
    href: "#",
    status: EProgressStatus.NOT_STARTED,
  },
  {
    content: "Creating new pool on ",
    target: ETarget.ALLO,
    href: "#",
    status: EProgressStatus.NOT_STARTED,
  },
  {
    content: "Indexing your pool on ",
    target: ETarget.SPEC,
    href: "",
    status: EProgressStatus.NOT_STARTED,
  },
  {
    content: "Indexing pool metadata on ",
    target: ETarget.IPFS,
    href: "",
    status: EProgressStatus.NOT_STARTED,
  },
];

export const NewPoolContext = React.createContext<INewPoolContextProps>({
  steps: initialSteps,
  createNewPool: async () => {
    return {
      poolId: 0,
      address: "0x1234",
    };
  },
});

// if true, set current step to success and next step to in progress, if false set current step to error

export const NewPoolContextProvider = (props: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [steps, setSteps] = useState<TProgressStep[]>(initialSteps);
  const { address } = useAccount();

  const updateStepTarget = (index: number, target: string) => {
    const newSteps = [...steps];
    newSteps[index].target = target;
    setSteps(newSteps);
  };

  const updateStepHref = (index: number, href: string) => {
    const newSteps = [...steps];
    newSteps[index].href = href;
    setSteps(newSteps);
  };

  const updateStepStatus = (index: number, flag: boolean) => {
    const newSteps = [...steps];
    if (flag) {
      newSteps[index].status = EProgressStatus.IS_SUCCESS;
    } else {
      newSteps[index].status = EProgressStatus.IS_ERROR;
    }

    if (steps.length > index)
      newSteps[index + 1].status = EProgressStatus.IN_PROGRESS;

    setSteps(newSteps);
    return newSteps;
  };

  const createNewPool = async (
    data: TNewPool,
    chain: number,
  ): Promise<TNewPoolResponse> => {
    const chainInfo = getChain(chain);

    // if data.profileName set a new step at index 0 of steps
    if (data.profileName) {
      const newSteps = [...steps];
      newSteps.unshift({
        content: "Creating new profile on ",
        target: ETarget.CHAIN,
        href: "",
        status: EProgressStatus.NOT_STARTED,
      });
      setSteps(newSteps);
    }

    // update step 0 to in progress
    setSteps((prevSteps) => {
      const newSteps = [...prevSteps];
      newSteps[0] = {
        ...newSteps[0],
        status: EProgressStatus.IN_PROGRESS,
      };
      return newSteps;
    });

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

    // return values
    let strategyAddress: string = "0x";
    let poolId: number = -1;
    const walletClient = await getWalletClient({ chainId: chain });

    let profileId = data.profileId;

    // if profileName is set, create profile
    if (data.profileName && address) {
      const registry = new Registry({ chain: chain });
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

        updateStepStatus(stepIndex, true);
      } catch (e) {
        updateStepStatus(stepIndex, false);
        console.log("Creating Profile", e);
      }

      stepIndex++;
    }

    // 1. Save metadata to IPFS
    const ipfsClient = getIPFSClient();

    const metadata = {
      profileId: profileId,
      name: data.name,
      website: data.website,
      description: data.description,
      base64Image: data.base64Image,
    };

    let imagePointer;
    let pointer;

    try {
      if (metadata.base64Image && metadata.base64Image.includes("base64")) {
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

    // 2. Deploy new pool strategy

    const strategy = new MicroGrantsStrategy({
      chain: chain,
    });

    const deployParams = strategy.getDeployParams();

    try {
      const hash = await walletClient!.deployContract({
        abi: deployParams.abi,
        bytecode: deployParams.bytecode as `0x${string}`,
        args: [],
      });

      const result = await waitForTransaction({ hash: hash, chainId: chain });
      strategyAddress = result.contractAddress!;

      updateStepTarget(stepIndex, `${chainInfo.name}`);
      updateStepHref(
        stepIndex,
        `${chainInfo.blockExplorers.default.url}/tx/` + strategyAddress,
      );
      updateStepStatus(stepIndex, true);
    } catch (e) {
      console.log("Deploying Strategy", e);
      updateStepStatus(stepIndex, false);
    }

    stepIndex++;

    const startDateInSeconds = Math.floor(
      new Date(data.startDate).getTime() / 1000,
    );

    const endDateInSeconds = Math.floor(
      new Date(data.endDate).getTime() / 1000,
    );

    const initParams = {
      useRegistryAnchor: data.useRegistryAnchor,
      allocationStartTime: BigInt(startDateInSeconds),
      allocationEndTime: BigInt(endDateInSeconds),
      approvalThreshold: BigInt(data.approvalThreshold),
      maxRequestedAmount: BigInt(data.maxAmount),
    };

    // create new pool
    const initStrategyData = await strategy.getInitializeData(initParams);

    const poolCreationData = {
      profileId: profileId,
      strategy: strategyAddress,
      initStrategyData: initStrategyData,
      token: data.tokenAddress,
      amount: BigInt(data.fundPoolAmount),
      metadata: {
        protocol: BigInt(1),
        pointer: pointer.IpfsHash,
      },
      managers: data.managers,
    };

    const allo = new Allo({
      chain: chain,
    });

    const createPoolData = await allo.createPoolWithCustomStrategy(
      poolCreationData,
    );

    try {
      const tx = await sendTransaction({
        to: createPoolData.to as string,
        data: createPoolData.data,
        value: BigInt(createPoolData.value),
      });

      const reciept =
        await wagmiConfigData.publicClient.waitForTransactionReceipt({
          hash: tx.hash,
        });

      const { logs } = reciept;
      poolId = Number(logs[6].topics[1]);

      updateStepTarget(stepIndex, `${chainInfo.name}`);
      updateStepHref(
        stepIndex,
        `${chainInfo.blockExplorers.default.url}/tx/` + tx.hash,
      );
      updateStepStatus(stepIndex, true);
    } catch (e) {
      updateStepStatus(stepIndex, false);
      console.log("Creating Pool", e);
    }

    stepIndex++;

    // 4. Index Pool
    const pollingData: any = {
      chainId: chain,
      poolId: poolId,
    };
    let pollingResult = await pollUntilDataIsIndexed(
      checkIfPoolIsIndexedQuery,
      pollingData,
      "microGrant",
    );

    if (pollingResult) {
      updateStepStatus(stepIndex, true);
    } else {
      console.log("Polling ERROR");
      updateStepStatus(stepIndex, false);
    }

    stepIndex++;

    // 5. Index Metadata

    const pollingMetadataResult = await pollUntilMetadataIsAvailable(
      pointer.IpfsHash,
    );

    if (pollingMetadataResult) {
      updateStepStatus(stepIndex, true);
    } else {
      console.log("Polling ERROR");
      updateStepStatus(stepIndex, false);
    }

    stepIndex++;

    setTimeout(() => {}, 5000);

    return {
      address: strategyAddress as `0x${string}`,
      poolId: poolId,
    };
  };

  return (
    <NewPoolContext.Provider
      value={{
        steps: steps,
        createNewPool: createNewPool,
      }}
    >
      {props.children}
    </NewPoolContext.Provider>
  );
};
