"use client";
import { EProgressStatus, ETarget, TProgressStep } from "@/app/types";
import { Allo, MicroGrantsStrategy } from "@allo-team/allo-v2-sdk";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import { SetAllocatorData } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { createContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { sendTransaction } from "@wagmi/core";
import { getChain, wagmiConfigData } from "@/services/wagmi";

const initialSteps: TProgressStep[] = [
  {
    id: 0,
    content: "Updating allocators on ",
    target: ETarget.POOL,
    href: "#",
    status: EProgressStatus.IN_PROGRESS,
  },
];

export interface IPoolContextProps {
  isAllocator: boolean;
  isPoolManager: boolean;
  strategy?: MicroGrantsStrategy;
  batchSetAllocator: (data: SetAllocatorData[]) => Promise<void>;
  steps: TProgressStep[];
}

export const PoolContext = createContext<IPoolContextProps>({
  isAllocator: false,
  isPoolManager: false,
  strategy: undefined,
  batchSetAllocator: async () => {},
  steps: initialSteps,
});

export const PoolContextProvider = (props: {
  chainId: string;
  poolId: string;
  children: JSX.Element | JSX.Element[];
}) => {
  const [steps, setSteps] = useState<TProgressStep[]>(initialSteps);
  const [isAllocator, setIsAllocator] = useState(false);
  const [isPoolManager, setIsPoolManager] = useState(false);
  const [strategy, setStrategy] = useState<MicroGrantsStrategy | undefined>(
    undefined,
  );

  const { isConnected, address } = useAccount();

  useEffect(() => {
    const checkAllocator = async () => {
      if (isConnected && address) {
        const allo = new Allo({
          chain: Number(props.chainId),
        });

        const _isPoolManager = await allo.isPoolManager(
          Number(props.poolId),
          address,
        );

        setIsPoolManager(_isPoolManager);

        const strategy = await allo.getStrategy(Number(props.poolId));
        const microGrants = new MicroGrantsStrategy({
          chain: Number(props.chainId),
          address: strategy as `0x${string}`,
          poolId: Number(props.poolId),
        });

        setStrategy(microGrants);

        const _isAllocator = await microGrants.allocator(address);
        setIsAllocator(_isAllocator);
      }
    };

    checkAllocator();
  }, [props.chainId, props.poolId, address]);

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

  const batchSetAllocator = async (data: SetAllocatorData[]) => {
    if (strategy) {
      const chainInfo = getChain(Number(props.chainId));

      const txData: TransactionData = strategy.getBatchSetAllocatorData(data);

      try {
        const tx = await sendTransaction({
          to: txData.to as string,
          data: txData.data,
          value: BigInt(txData.value),
        });

        await wagmiConfigData.publicClient.waitForTransactionReceipt({
          hash: tx.hash,
        });

        updateStepTarget(0, `${chainInfo.name} at ${tx.hash}`);
        updateStepHref(
          0,
          `${chainInfo.blockExplorers.default.url}/tx/` + tx.hash,
        );

        updateStepStatus(0, EProgressStatus.IS_SUCCESS);
      } catch (e) {
        console.log("Updating Allocators", e);
        updateStepStatus(0, EProgressStatus.IS_ERROR);
      }
    }
  };

  return (
    <PoolContext.Provider
      value={{
        isAllocator,
        isPoolManager,
        strategy,
        batchSetAllocator,
        steps,
      }}
    >
      {props.children}
    </PoolContext.Provider>
  );
};
