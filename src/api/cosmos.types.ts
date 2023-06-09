export interface Block {
  height: number;
  hash: string;
  transactions: Transaction[];
}

export interface Transaction {
  hash: string;
  fromAddress: string;
  toAddress: string;
  asset: string;
  amount: string;
  memo?: string;
  blockHeight: number;
}
