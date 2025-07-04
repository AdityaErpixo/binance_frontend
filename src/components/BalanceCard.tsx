import React, { useEffect, useState } from "react";
import { FiInfo, FiChevronDown } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { getWalletOverview } from "../wallet-services/api";
import { fetchCryptoPrices } from "../services/FetchData";
import DepositDrawer from "./DepositDrawer";

interface WalletBalance {
  balance: number;
  currency: string;
}

interface Wallet {
  balances: WalletBalance[];
  type: string;
}

interface WalletOverviewResponse {
  walletsOverview: {
    wallets: Wallet[];
    totalValueUSD: string;
  };
}

type Currency = "BTC" | "ETH" | "BNB" | "USDT";

const BalanceCard: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("BTC");
  const [showDropdown, setShowDropdown] = useState(false);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [currencyBalance, setCurrencyBalance] = useState<number>(0);
  const [isDepositDrawerOpen, setIsDepositDrawerOpen] = useState(false);

    const handleDepositClick = () => {
    setIsDepositDrawerOpen(true);
  };

  const handleCloseDepositDrawer = () => {
    setIsDepositDrawerOpen(false);
  };

  // Fetch wallet data
  const { data: walletData, isLoading, error } = useQuery<WalletOverviewResponse>({
    queryKey: ['walletOverview'],
    queryFn: getWalletOverview,
    refetchInterval: 30000,
  });

  // Fetch crypto prices
  const { data: prices } = useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: fetchCryptoPrices,
    refetchInterval: 60000, // Refresh every minute
  });

  useEffect(() => {
    if (walletData?.walletsOverview && prices) {
      let currencyTotal = 0;
      let allBalancesTotal = 0;

      // Calculate balances for selected currency and total portfolio value
      walletData.walletsOverview.wallets.forEach(wallet => {
        wallet.balances.forEach(balance => {
          const currency = balance.currency as Currency;
          const price = prices[currency] || 0;
          const value = balance.balance * price;
          
          allBalancesTotal += value;
          
          if (currency === selectedCurrency) {
            currencyTotal += balance.balance;
          }
        });
      });

      setTotalBalance(allBalancesTotal);
      setCurrencyBalance(currencyTotal);
    }
  }, [walletData, prices, selectedCurrency]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const getCurrentPrice = () => {
    return prices?.[selectedCurrency] || 0;
  };

  const currencies: Currency[] = ["BTC", "ETH", "BNB", "USDT"];

  if (isLoading || !prices) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-red-500 dark:text-red-400">
          Error loading wallet data: {(error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Estimated Balance</h2>
            <FiInfo className="w-4 h-4 text-gray-400" />
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {currencyBalance.toFixed(selectedCurrency === "BTC" ? 8 : 2)}
              </span>
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-1 text-lg text-gray-500 dark:text-gray-400"
                >
                  <span>{selectedCurrency}</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-20 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-10">
                    {currencies.map(currency => (
                      <button
                        key={currency}
                        onClick={() => {
                          setSelectedCurrency(currency);
                          setShowDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm ${
                          currency === selectedCurrency 
                            ? 'bg-gray-100 dark:bg-gray-600 text-yellow-500' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {currency}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              ≈ {formatCurrency(currencyBalance * getCurrentPrice())}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Portfolio Value: {formatCurrency(totalBalance)}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6 lg:mt-0">
          <button
              onClick={handleDepositClick}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2.5 rounded-lg font-medium text-sm transition-colors">
            Deposit
          </button>
          <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors">
            Withdraw
          </button>
          <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors">
            Cash In
          </button>
        </div>
      </div>
      {/* Additional wallet balances
      {allBalances.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Wallet Balances</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allBalances.map(({ currency, balance, walletTypes }) => (
              <div key={currency} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currency}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {walletTypes.join(', ')}
                  </span>
                </div>
                <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {balance.toFixed(8)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ≈ {formatCurrency(balance * (currency === 'BTC' ? btcPrice : 1))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
      {/* Deposit Drawer */}
      <DepositDrawer 
        isOpen={isDepositDrawerOpen} 
        onClose={handleCloseDepositDrawer} 
      />
      </>
  );
};

export default BalanceCard;