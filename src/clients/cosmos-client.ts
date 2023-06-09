import axios, { AxiosInstance } from 'axios';

class CosmosClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL });
  }

  public async getNodeInfo(): Promise<any> {
    const response = await this.client.get('/node_info');
    return response.data;
  }

  public async getLatestBlock(): Promise<any> {
    const response = await this.client.get('/blocks/latest');
    return response.data;
  }

  public async getLatestBlockHeight(): Promise<number> {
    const latestBlockResponse = await this.getLatestBlock();
    const latestBlockHeight: number = latestBlockResponse.block.header.height;
    return Number(latestBlockHeight);
  }

  public async getBlock(height: number): Promise<any> {
    const response = await this.client.get(`/blocks/${height}`);
    return response.data;
  }

  public async getTransaction(txHash: string): Promise<any> {
    const response = await this.client.get(`/txs/${txHash}`);
    return response.data;
  }

  public async getAccount(address: string): Promise<any> {
    const response = await this.client.get(`/auth/accounts/${address}`);
    return response.data;
  }
}

export default CosmosClient;
