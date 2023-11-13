"use client";
import Container from "@/components/Container";

import { MicroGrantsStrategy } from "../../../../allo-v2-sdk/dist/strategies/MicroGrantsStrategy/MicroGrantsStrategy";
import { sendTransaction } from "@wagmi/core";

const NewPool = () => {
  const strategy = new MicroGrantsStrategy({
    chain: 5,
  });

  const deploy = async () => {
    const deployParams = strategy.getDeployParams();
    const { hash } = await sendTransaction({
      to: "0x0000000000000000000000000000000000000000",
      data: deployParams.bytecode,
    });

    console.log(hash);
  };

  const deployData = strategy.getDeployParams();

  // console.log(deployData);

  return (
    <Container>
      <div>
        hello <button onClick={() => deploy()}>deploy</button>
      </div>
    </Container>
  );
};

export default NewPool;
