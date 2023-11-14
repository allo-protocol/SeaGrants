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
