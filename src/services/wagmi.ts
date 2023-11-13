"use client";
import {
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import {
  arbitrum,
  arbitrumGoerli,
  base,
  celoAlfajores,
  celo,
  goerli,
  sepolia,
  mainnet,
  optimism,
  polygon,
  polygonMumbai
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";

const stagingChains = [
  celoAlfajores,
  goerli,
  sepolia,
  polygonMumbai,
  arbitrumGoerli
];

const productionChains = [
  arbitrum,
  base,
  celo,
  mainnet,
  polygon,
  optimism
];

const availableChains = process.env.ENVIRONMENT === "dev" ? stagingChains : productionChains;

const { chains, publicClient } = configureChains(
  [...availableChains],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID as string }),
    infuraProvider({ apiKey: process.env.INFURA_ID as string }),
    publicProvider(),
  ],
);

const { connectors } = getDefaultWallets({
  appName: "Micro Grants",
  projectId: process.env.PROJECT_ID as string || "YOUR_PROJECT_ID",
  chains,
});

export const wagmiConfigData = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export const chainData = chains;