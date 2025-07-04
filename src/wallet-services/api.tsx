import { WalletType } from '../components/Transfer';
import {WalletOverviewResponse } from './types';

const API_URL = 'https://signed-simultaneously-mount-christopher.trycloudflare.com/graphql ';

export const depositFunds = async (input: { currency: string; amount: number }) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      query: `
        mutation Deposit($currency: String!, $amount: Float!) {
          deposit(currency: $currency, amount: $amount) {
            currency
            balance
            locked
          }
        }
      `,
      variables: input
    })
  });

  const data = await response.json();
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.deposit;
};


export const transferFunds = async (input: {
  fromType: 'Spot' | 'Margin' | 'Futures' | 'Funding' | 'ThirdParty';
  toType: 'Spot' | 'Margin' | 'Futures' | 'Funding' | 'ThirdParty';
  currency: string;
  amount: number;
}) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      query: `
        mutation Transfer(
          $fromType: WalletType!,
          $toType: WalletType!,
          $currency: String!,
          $amount: Float!
        ) {
          transfer(
            fromType: $fromType,
            toType: $toType,
            currency: $currency,
            amount: $amount
          )
        }
      `,
      variables: input
    })
  });

  const data = await response.json();
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.transfer;
};

// Add this to wallet-services/api.tsx
export const getWalletBalance = async (type: WalletType, currency: string) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      query: `
        query GetBalance($type: WalletType!, $currency: String!) {
          walletBalance(type: $type, currency: $currency) {
            balance
          }
        }
      `,
      variables: {
        type,
        currency
      }
    })
  });

  const data = await response.json();
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.walletBalance.balance;
};

export const getSpotWallet = async (): Promise<WalletOverviewResponse> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      query: `
        query GetSpotWallet {
          walletByType(type: Spot) {
            balances {
              currency
              balance
            }
          }
        }
      `
    })
  });

  const data = await response.json();
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data;
};


export const getWalletOverview = async (): Promise<WalletOverviewResponse> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      query: `
        query Wallets {
          walletsOverview {
            wallets {
              balances {
                balance
                currency
              }
              type
            }
            totalValueUSD
          }
        }
      `
    })
  });

  const data = await response.json();
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data;
};

export const getDepositAddress = async (
  currency: string
): Promise<string> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      query: `
        query DepositAddress($currency: String!) {
          depositAddress(currency: $currency)
        }
      `,
      variables: { currency },
    }),
  });

  const data = await response.json();
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.depositAddress;
};

