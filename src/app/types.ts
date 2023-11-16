type ApplicationStatus = "Accepted" | "Rejected" | "Pending" | "Paid";

export type TApplication = {
  id: number;
  name: string;
  description?: string;
  status: ApplicationStatus;
  imageUrl: string;
  // name: string;
  recipientAddress: string;
  amountRequested: string;
};

export interface IApplication extends TApplication {
  profileOwner: string;
  nonce: number;
  createdAt: string;
  updatedAt?: string;
}
//   id: number;
//   name: string;
//   website: string;
//   email: string;
//   description?: string;
//   imageUrl: string;
//   recipientAddress: string;
//   profileOwner: string;
//   nonce: number;
// }

export type TPool = {
  id: number;
  name: string;
  chainId: number;
  dates: {
    start: string;
    end: string;
  };
  strategy: `0x${string}`; // address of the strategy contract
  amount: number;
  tokenSymbol: string;
  active: boolean;
};

export type TProfile = {
  id: `0x${string}`;
  recipientAddress: string;
  profileOwner: string;
  nonce: number;
  members: `0x${string}`[];
};

// Application
export type TNewApplication = {
  name: string;
  website: string;
  description: string;
  requestedAmount: number;
  email: string;
  recipientAddress: string;
  base64Image: string;
  profileOwner: string;
  nonce: number;
};

export type TNewPool = {
  // pool metadata info
  profileId: string;
  name: string;
  website: string;
  description: string;
  imageUrl?: string;
  // chain info
  tokenAddress: string;
  fundPoolAmount: string;
  maxAmount: string;
  managers: string[];
  startDate: string;
  endDate: string;
  approvalThreshold: number;
  useRegistryAnchor: boolean;
};

export type TPoolData = {
  address: string;
  poolId: number;
};

// Progress Modal

export enum ETarget {
  NONE = "None",
  IPFS = "IPFS",
  CHAIN = "Blockchain",
  SPEC = "Spec",
  POOL = "Pool",
  ALLO = "Allo",
}

export enum EProgressStatus {
  IS_SUCCESS = "IS_SUCCESS",
  IN_PROGRESS = "IN_PROGRESS",
  NOT_STARTED = "NOT_STARTED",
  IS_ERROR = "IS_ERROR",
}

export type TProgressStep = {
  id: number;
  content: string;
  target?: string;
  href?: string;
  status: EProgressStatus;
};