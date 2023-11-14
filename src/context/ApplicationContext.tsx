"use client";
import React, { useState } from "react";
import { MicroGrantsStrategy } from "@allo-team/allo-v2-sdk/";

import { getIPFSClient } from "@/services/ipfs";
import {
  EProgressStatus,
  ETarget,
  TNewApplication,
  TProgressStep,
} from "@/app/types";
import { sendTransaction } from "@wagmi/core";
import { useWaitForTransaction } from "wagmi";
import { waitForTransactionReceipt } from "viem/actions";
import { wagmiConfigData } from "@/services/wagmi";

export interface IApplicationContextProps {
  steps: TProgressStep[];
  createApplication: (
    data: TNewApplication,
    chain: number,
    poolId: number
  ) => Promise<string>;
}

const initialSteps: TProgressStep[] = [
  {
    id: 0,
    content: "Saving your application to ",
    target: ETarget.IPFS,
    href: "",
    status: EProgressStatus.IN_PROGRESS,
  },
  {
    id: 1,
    content: "Registering to pool",
    target: ETarget.CHAIN,
    href: "#",
    status: EProgressStatus.NOT_STARTED,
  },
];

export const ApplicationContext = React.createContext<IApplicationContextProps>(
  {
    steps: initialSteps,
    createApplication: async () => {
      console.log("hello World");
      return "";
    },
  }
);

export const ApplicationContextProvider = (props: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [steps, setSteps] = useState<TProgressStep[]>(initialSteps);

  const updateStepStatus = (index: number, status: EProgressStatus) => {
    const newSteps = [...steps];
    newSteps[index].status = status;
    setSteps(newSteps);
  };

  const updateStepHref = (index: number, href: string) => {
    const newSteps = [...steps];
    newSteps[index].href = href;
    setSteps(newSteps);
  };

  const createApplication = async (
    data: TNewApplication,
    chain: number,
    poolId: number
  ): Promise<string> => {
    // 1. Save metadata to IPFS
    const ipfsClient = getIPFSClient();

    const metadata = {
      name: data.name,
      website: data.website,
      description: data.description,
      email: data.email,
      imageUrl: data.imageUrl,
      profileOwner: data.profileOwner,
    };

    let pointer;

    try {
      pointer = await ipfsClient.pinJSON(metadata);
      updateStepHref(0, "https://ipfs.ip/ipfs/" + pointer.IpfsHash);
      updateStepStatus(0, EProgressStatus.IS_SUCCESS);
      updateStepStatus(1, EProgressStatus.IN_PROGRESS);
    } catch (e) {
      updateStepStatus(0, EProgressStatus.IS_ERROR);
      // throw e;
    }

    // 2. Create profile on registry
    // TODO

    // 3. Register Recipient
    const strategy = new MicroGrantsStrategy({ chain, poolId });

    const registerRecipientData = strategy.getRegisterRecipientData({
      recipientAddress: data.recipientAddress as `0x${string}`,
      requestedAmount: BigInt(0),
      metadata: {
        protocol: BigInt(1),
        pointer: pointer.IpfsHash,
      },
    });

    try {
      const tx = await sendTransaction({
        to: registerRecipientData.to as string,
        data: registerRecipientData.data,
        value: BigInt(1),
      });

      const reciept = await wagmiConfigData.publicClient.waitForTransactionReceipt({
        hash: tx.hash,
      });

      console.log(tx.hash);
      console.log("SHIT", reciept);

      updateStepStatus(1, EProgressStatus.IS_SUCCESS);
    } catch {
      updateStepStatus(1, EProgressStatus.IS_ERROR);
    }

    // 3. Register application to pool

    return pointer.IpfsHash;
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
