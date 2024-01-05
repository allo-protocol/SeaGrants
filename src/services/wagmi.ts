"use client";

import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import {
  arbitrum,
  base,
  celo,
  goerli,
  mainnet,
  optimism,
  polygon
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";

import dotenv from "dotenv";
dotenv.config();

const stagingChains = [
  // celoAlfajores,
  goerli,
  // sepolia,
  // polygonMumbai,
  // arbitrumGoerli,
];

const productionChains = [goerli];

const availableChains =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "dev"
    ? stagingChains
    : productionChains;

const { chains, publicClient } = configureChains(
  [...availableChains],
  [
    alchemyProvider({
      apiKey:
        (process.env.ALCHEMY_ID as string) ||
        "s7TJ6rGOukJ11mysb07TLtR0qtF0wVGd",
    }),
    infuraProvider({
      apiKey:
        (process.env.INFURA_ID as string) || "ae7716bbd9e540efb367c0694f9c4667",
    }),
    publicProvider(),
  ],
);

const { connectors } = getDefaultWallets({
  appName: "Micro Grants",
  projectId: (process.env.PROJECT_ID as string) || "950dbdf6f1d331fbc81e384788249b0b",
  chains,
});

export const wagmiConfigData = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export const chainData = chains;

export const getChain = (chainId: number) => {
  for (const chain of Object.values(chains)) {
    if (chain.id === chainId) {
      return chain;
    }
  }

  throw new Error(`Chain with id ${chainId} not found`);
}
