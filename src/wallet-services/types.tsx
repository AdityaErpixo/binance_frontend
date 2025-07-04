interface DepositInput {
  currency: string;
  amount: number;
}

interface DepositResponse {
  currency: string;
  balance: number;
  locked: number;
}


export interface TransferInput {
  from: 'FUNDING' | 'SPOT' | 'EARN';
  to: 'FUNDING' | 'SPOT' | 'EARN';
  coin: string;
  amount: number;
}



export interface WalletBalance {
  type: string;
  balances: {
    currency: string;
    balance: number;
  }[];
}

export interface WalletOverviewResponse {
  walletsOverview: {
    wallets: WalletBalance[];
    totalValueUSD: number;
  };
}
