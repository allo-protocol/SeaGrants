import IPFSClient, { getIPFSClient } from "@/services/ipfs";

export type NewApplication = {
  name: string;
  website: string;
  description: string;
  email: string;
  recipientAddress: string;
  imageUrl: string;
  profileOwner: string;
  nonce: number
};

export class ApplicationContext {

  async createApplication(data: NewApplication): string {
    
    // 1. Pin the application metadata to IPFS
    const ipfsClient = getIPFSClient();

    const metadata = {
      name: data.name,
      website: data.website,
      description: data.description,
      email: data.email,
      imageUrl: data.imageUrl,
      profileOwner: data.profileOwner,
    }

    const pointer = await ipfsClient.pinJSON(metadata);

    // toggle status

    // 2. Create profile on registry
    // TODO

    // 3. Register application to pool

    const recipientId = "";

    return recipientId;
  }
}