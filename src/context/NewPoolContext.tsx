"use client";
import React, { useState } from "react";
import { MicroGrantsStrategy, Allo } from "@allo-team/allo-v2-sdk/";

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

export interface INewPoolContextProps {
  steps: TProgressStep[];
  createNewPool: (data: TNewPool, chain: number) => Promise<TNewPoolResponse>;
}

const initialSteps: TProgressStep[] = [
  {
    id: 0,
    content: "Saving your banner image to ",
    target: ETarget.IPFS,
    href: "",
    status: EProgressStatus.IN_PROGRESS,
  },
  {
    id: 1,
    content: "Saving your application to ",
    target: ETarget.IPFS,
    href: "",
    status: EProgressStatus.IN_PROGRESS,
  },
  {
    id: 2,
    content: "Deploying new pool strategy to ",
    target: ETarget.CHAIN,
    href: "#",
    status: EProgressStatus.NOT_STARTED,
  },
  {
    id: 3,
    content: "Creating new pool on ",
    target: ETarget.ALLO,
    href: "#",
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

export const NewPoolContextProvider = (props: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [steps, setSteps] = useState<TProgressStep[]>(initialSteps);

  const updateStepTarget = (index: number, target: string) => {
    const newSteps = [...steps];
    newSteps[index].target = target;
    setSteps(newSteps);
  };

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

  const createNewPool = async (
    data: TNewPool,
    chain: number,
  ): Promise<TNewPoolResponse> => {
    const chainInfo = getChain(chain);

    // return values
    let strategyAddress: string = "0x";
    let poolId: number = -1;

    updateStepTarget(1, `${chainInfo.name}`);

    // 1. Save metadata to IPFS
    const ipfsClient = getIPFSClient();

    const metadata = {
      profileId: data.profileId,
      name: data.name,
      website: data.website,
      description: data.description,
      base64Image: data.base64Image,
    };

    let imagePointer;
    let pointer;

    if (!metadata.base64Image || !metadata.base64Image.includes("base64")) {
      const newSteps = [...steps];
      newSteps.shift();
      updateStepStatus(0, EProgressStatus.IS_SUCCESS);
      updateStepStatus(1, EProgressStatus.IN_PROGRESS);
      setSteps(newSteps);
    }

    try {
      if (metadata.base64Image && metadata.base64Image.includes("base64")) {
        imagePointer = await ipfsClient.pinJSON({
          data: metadata.base64Image,
        });
        metadata.base64Image = imagePointer.IpfsHash;
        updateStepHref(0, "https://ipfs.io/ipfs/" + imagePointer.IpfsHash);
        updateStepStatus(0, EProgressStatus.IS_SUCCESS);
        updateStepStatus(1, EProgressStatus.IN_PROGRESS);
      }

      pointer = await ipfsClient.pinJSON(metadata);
      updateStepHref(1, "https://ipfs.io/ipfs/" + pointer.IpfsHash);
      updateStepStatus(1, EProgressStatus.IS_SUCCESS);
      updateStepStatus(2, EProgressStatus.IN_PROGRESS);
    } catch (e) {
      console.log("IPFS", e);
      updateStepStatus(1, EProgressStatus.IS_ERROR);
    }

    // 2. Deploy new pool strategy

    const strategy = new MicroGrantsStrategy({
      chain: chain,
    });

    const deployParams = strategy.getDeployParams();

    const walletClient = await getWalletClient({ chainId: chain });

    try {
      const hash = await walletClient!.deployContract({
        abi: deployParams.abi,
        bytecode: deployParams.bytecode as `0x${string}`,
        args: [],
      });

      const result = await waitForTransaction({ hash: hash, chainId: chain });
      strategyAddress = result.contractAddress!;

      updateStepTarget(2, `${chainInfo.name}`);
      updateStepHref(
        2,
        `${chainInfo.blockExplorers.default.url}/tx/` + strategyAddress,
      );
      updateStepStatus(2, EProgressStatus.IS_SUCCESS);
    } catch (e) {
      console.log("Deploying Strategy", e);
      updateStepStatus(2, EProgressStatus.IS_ERROR);
    }

    const startDateInSeconds = Math.floor(
      new Date(data.startDate).getTime() / 1000,
    );

    const endDateInSeconds = Math.floor(
      new Date(data.endDate).getTime() / 1000,
    );

    // create new pool

    const initStrategyData = await strategy.getInitializeData({
      useRegistryAnchor: data.useRegistryAnchor,
      allocationStartTime: BigInt(startDateInSeconds),
      allocationEndTime: BigInt(endDateInSeconds),
      approvalThreshold: BigInt(data.approvalThreshold),
      maxRequestedAmount: BigInt(data.maxAmount),
    });

    const poolCreationData = {
      profileId: data.profileId,
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

      updateStepTarget(3, `${chainInfo.name}`);
      updateStepHref(
        3,
        `${chainInfo.blockExplorers.default.url}/tx/` + tx.hash,
      );
      updateStepStatus(3, EProgressStatus.IS_SUCCESS);
    } catch (e) {
      updateStepStatus(3, EProgressStatus.IS_ERROR);
      console.log("Creating Pool", e);
    }

    return {
      address: strategyAddress,
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
