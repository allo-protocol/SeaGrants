"use client";

import Container from "@/components/shared/Container";

import { Allo } from "@allo-team/allo-v2-sdk/";
import { MicroGrantsStrategy } from "@allo-team/allo-v2-sdk";

import {
  useNetwork,
  usePrepareSendTransaction,
  useWaitForTransaction,
  useWalletClient,
} from "wagmi";
import { useEffect, useState } from "react";
import { sendTransaction } from "@wagmi/core";

const NewPool = () => {
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient({ chainId: chain?.id || 5 });
  const [hash, setHash] = useState<undefined | `0x${string}`>();
  const [address, setAddress] = useState<null | `0x${string}`>();

  const [alloAddress, setAlloAddress] = useState<null | `0x${string}`>();
  const [creationData, setCreationData] = useState<null | `0x${string}`>();
  const [creationHash, setCreationHash] = useState<undefined | `0x${string}`>();
  const [poolId, setPoolId] = useState<number>();

  const {
    data: deployTx,
    isError,
    isLoading,
  } = useWaitForTransaction({
    hash,
  });

  const {
    data: creationTx,
    isError: isCreationError,
    isLoading: isCreationLoading,
  } = useWaitForTransaction({
    hash: creationHash,
  });

  const strategy = new MicroGrantsStrategy({
    chain: chain?.id || 5,
  });

  const { config } = usePrepareSendTransaction({
    to: alloAddress || "",
    data: creationData || "0x",
  });

  const deploy = async () => {
    const deployParams = strategy.getDeployParams();
    const hash = await walletClient?.deployContract({
      abi: deployParams.abi,
      bytecode: deployParams.bytecode as `0x${string}`,
      args: [],
    });
    setHash(hash);
  };

  const createPool = async () => {
    const allo = new Allo({
      chain: chain!.id,
    });

    const date = new Date();

    const dateInSeconds = Math.floor(date.getTime() / 1000);

    console.log(dateInSeconds);

    const initStrategyData = await strategy.getInitializeData({
      useRegistryAnchor: false,
      allocationStartTime: BigInt(dateInSeconds + 5 * 60),
      allocationEndTime: BigInt(dateInSeconds + 60 * 60 * 24 * 7), // + 7 days
      approvalThreshold: BigInt(1),
      maxRequestedAmount: BigInt(1000000000000000000),
    });

    const poolCreationData = {
      profileId:
        "0xc9a3fd1618bcff93ea3c1cd94e3b1ac052007733c1a720e5d990699a0949e891", // Jaxcoder on Alfajores
      strategy: address,
      initStrategyData: initStrategyData,
      token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      amount: BigInt(0),
      metadata: {
        protocol: BigInt(0),
        pointer: "bafkreiarrwctnfncvpgwopgxj7mfu2fvlyh7mnyts7hb2rt2qwpqkabelq",
      },
      managers: [],
    };

    const data = await allo.createPoolWithCustomStrategy(poolCreationData);

    console.log(poolCreationData);

    setAlloAddress(data.to);
    setCreationData(data.data);

    const txHash = await sendTransaction({
      ...config,
      to: data.to,
      data: data.data,
    });

    setCreationHash(txHash.hash);
  };

  useEffect(() => {
    if (deployTx) {
      setAddress(deployTx.contractAddress);
    }
  }, [deployTx]);

  useEffect(() => {
    if (creationTx) {
      console.log("====================================");
      console.log(creationTx.logs[6].topics[1]);
      setPoolId(Number(creationTx.logs[6].topics[1]));
    }
  }, [creationTx]);

  return (
    <Container>
      <div>
        Deploy a new Strategy: <br />
        <button
          className="bg-blue-300 p-2 rounded-md"
          onClick={() => {
            console.log("deploy");
            deploy();
          }}
        >
          deploy
        </button>
        <br />
        {isLoading && <div>loading...</div>}
        {isError && <div>error...</div>}
        {address && (
          <div>
            address: {address}
            <br />
            Create a pool: <br />
            <button
              className="bg-blue-300 p-2 rounded-md"
              onClick={() => createPool()}
            >
              create pool
            </button>
          </div>
        )}
        {poolId && <div>poolId: {poolId}</div>}
      </div>
    </Container>
  );
};

export default NewPool;
