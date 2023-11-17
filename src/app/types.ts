type ApplicationStatus = "Accepted" | "Rejected" | "Pending" | "Paid";

export type TApplication = {
  id: number;
  name: string;
  description?: string;
  status: ApplicationStatus;
  base64Image: string;
  // name: string;
  recipientAddress: `0x${string}`;
  amountRequested: string;
};

export interface IApplication extends TApplication {
  profileOwner: `0x${string}`;
  nonce: number;
  createdAt: string;
  updatedAt?: string;
}

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
  recipientId: `0x${string}`;
  recipientAddress: `0x${string}`;
  requestedAmount: string;
  metadataPointer: string;
  isUsingRegistryAnchor: boolean;
  status: string;
};

// Application
export type TNewApplication = {
  name: string;
  website: string;
  description: string;
  requestedAmount: number;
  email: string;
  recipientAddress: `0x${string}`;
  base64Image: string;
  profileOwner: `0x${string}`;
  nonce: number;
};

export type TPoolMetadata = {
  profileId: `0x${string}`;
  name: string;
  website: string;
  description: string;
  base64Image?: string;
};

export type TNewPool = TPoolMetadata & {
  // chain info
  tokenAddress: `0x${string}`;
  fundPoolAmount: string;
  maxAmount: string;
  managers: `0x${string}`[];
  startDate: string;
  endDate: string;
  approvalThreshold: number;
  useRegistryAnchor: boolean;
};

export type TNewPoolResponse = {
  address: `0x${string}`;
  poolId: number;
};

export type TPoolData = {
  poolId: string;
  chainId: string;
  strategy: string;
  allocationStartTime: number;
  allocationEndTime: number;
  approvalThreshold: number;
  maxRequestedAmount: string;
  pool: {
    tokenMetadata: {
      name?: string;
      symbol?: string;
      decimals?: number;
    };
    token: `0x${string}`;
    amount: string;
    metadataPointer: string;
    profile: {
      profileId: `0x${string}`;
      name: string;
    };
  };
};

export type TAllocatedData = {
  recipientId: `0x${string}`;
  recipientAddress: `0x${string}`;
  sender: `0x${string}`;
  contractAddress: `0x${string}`;
  contractName: string;
  chainId: string;
  amount: string;
  blockTimestamp: string;
};

export type TDistributedData = {
  recipientId: `0x${string}`;
  recipientAddress: `0x${string}`;
  sender: `0x${string}`;
  contractAddress: `0x${string}`;
  contractName: string;
  chainId: string;
  amount: string;
  blockTimestamp: string;
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
