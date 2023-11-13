type ApplicationStatus = "Accepted" | "Rejected" | "Pending" | "Paid";

export type Application = {
  id: number;
  title: string;
  description?: string;
  status: ApplicationStatus;
  imageUrl: string;
  // name: string;
  amountRequested: string;
  createdAt: string;
  updatedAt?: string;
};
