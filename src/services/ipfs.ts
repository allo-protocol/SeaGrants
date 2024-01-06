export type Config = {
  jwt: string;
  readGateway: string;
  writeGateway: string;
};

export const getIPFSClient = (): IPFSClient => {

  const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1ZTlmNjIxNi0xMDMwLTQzZjktYWUxYi1kZTc2NTExNGUyNjIiLCJlbWFpbCI6InJjZXNhckB1ZWVzLmVkdS5lYyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2NDEzNjk5N2E2MDhiMmJmOTk1NSIsInNjb3BlZEtleVNlY3JldCI6Ijg0NTc1MzNhZTk3ODY5YTZiYzBjNGVkOTMxOTVkZjUwY2RkOTk4NTZiMzI0MmQ2NGFlMGMwMjI5ZWUyNjkyYmMiLCJpYXQiOjE3MDM3MTk5Mjh9.qo-r-yjF8yQ5QhhjsXG10zYdgoezC8okPwpKB13oE9c";
  const readGateway = "amber-major-owl-227.mypinata.cloud";
  const writeGateway = "https://api.pinata.cloud/";

  if (!jwt || !readGateway || !writeGateway) {
    throw new Error("Missing IPFS configuration");
  }

  return new IPFSClient({
    jwt,
    readGateway,
    writeGateway,
  });
};

export default class IPFSClient {
  private jwt: string;

  private readGateway: string;

  private writeGateway: string;

  private pinJSONToIPFSUrl: string;

  private pinFileToIPFSUrl: string;

  constructor(config: Config) {
    this.jwt = config.jwt;
    this.readGateway = config.readGateway;
    this.writeGateway = config.writeGateway;

    this.pinJSONToIPFSUrl = `${this.writeGateway}pinning/pinJSONToIPFS`;
    this.pinFileToIPFSUrl = `${this.writeGateway}pinning/pinFileToIPFS`;
  }

  fileUrl(cid: string) {
    return `${this.readGateway}ipfs/${cid}`;
  }

  async fetchText(cid: string) {
    const url = this.fileUrl(cid);
    const resp = await fetch(url);
    return await resp.text();
  }

  async fetchJson(cid: string) {
    const url = this.fileUrl(cid);
    const resp = await fetch(url);
    return await resp.json();
  }

  baseRequestData(name: string) {
    return {
      pinataOptions: {
        cidVersion: 1,
      },
      pinataMetadata: {
        name,
        keyvalues: {
          app: "micro-grants",
        },
      },
    };
  }

  async pinJSON(object: any) {
    const data = {
      ...this.baseRequestData("micro-grants"),
      pinataContent: object,
    };

    const resp = await fetch(this.pinJSONToIPFSUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.jwt}`,
      },
      body: JSON.stringify(data),
    });
    if (resp.ok) {
      return resp.json();
    }
    return await Promise.reject(resp);
  }

  async pinFile(file: Blob) {
    const fd = new FormData();
    const requestData = this.baseRequestData("project-image");

    fd.append("file", file);
    fd.append("pinataOptions", JSON.stringify(requestData.pinataOptions));
    fd.append("pinataMetadata", JSON.stringify(requestData.pinataMetadata));

    const resp = await fetch(this.pinFileToIPFSUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
      body: fd,
    });
    if (resp.ok) {
      return resp.json();
    }
    return await Promise.reject(resp);
  }
}
