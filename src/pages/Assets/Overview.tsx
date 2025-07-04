import { useMemo, useState } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import RecentTransactions from "../../components/RecentTransactions";
import MyAssets from "../../components/MyAssets";
import { useQuery } from "@tanstack/react-query";
import { getWalletOverview, transferFunds } from "../../wallet-services/api";
import { fetchCryptoPrices } from "../../services/FetchData";
import TransferModal from "../../components/Transfer";

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

interface Balances {
  [key: string]: {
    amount: string;
    usd: string;
  };
}

export default function Overview() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("BTC");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  const { isDark } = useTheme();
  const [showTransferModal, setShowTransferModal] = useState(false);

  const currencies: Currency[] = ["BTC", "ETH", "BNB", "USDT"];

  // Fetch wallet data
  const { data: walletData, isLoading, error } = useQuery<WalletOverviewResponse>({
    queryKey: ['walletOverview'],
    queryFn: getWalletOverview,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: prices } = useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: fetchCryptoPrices,
    refetchInterval: 60000, // Refresh every minute
  });

  const processBalances = (): Balances => {
    const defaultBalances: Balances = {
      BTC: { amount: "0.00", usd: "$0.00" },
      ETH: { amount: "0.00", usd: "$0.00" },
      BNB: { amount: "0.00", usd: "$0.00" },
      USDT: { amount: "0.00", usd: "$0.00" },
    };

    if (!walletData?.walletsOverview?.wallets || !prices) return defaultBalances;

    // Combine balances from all wallet types (Spot, Funding, etc.)
    const combinedBalances: Record<string, number> = {};

    walletData.walletsOverview.wallets.forEach((wallet) => {
      wallet.balances.forEach((balance) => {
        if (currencies.includes(balance.currency as Currency)) {
          const currency = balance.currency as Currency;
          combinedBalances[currency] = (combinedBalances[currency] || 0) + balance.balance;
        }
      });
    });

    // Convert to display format using real prices
    Object.entries(combinedBalances).forEach(([currency, amount]) => {
      const price = prices[currency as Currency] || 0;
      defaultBalances[currency as Currency] = {
        amount: amount.toFixed(8),
        usd: `$${(amount * price).toFixed(2)}`,
      };
    });

    return defaultBalances;
  };

  const balances = processBalances();
  const totalValueUSD = useMemo(() => {
    if (!walletData?.walletsOverview?.wallets || !prices) return "$0.00";
    
    let total = 0;
    walletData.walletsOverview.wallets.forEach(wallet => {
      wallet.balances.forEach(balance => {
        if (currencies.includes(balance.currency as Currency)) {
          total += balance.balance * (prices[balance.currency as Currency] || 0);
        }
      });
    });
    
    return `$${total.toFixed(2)}`;
  }, [walletData, prices]);

  const handleTransfer = async (data: {
    fromType: 'Spot' | 'Margin' | 'Futures' | 'Funding' | 'ThirdParty';
    toType: 'Spot' | 'Margin' | 'Futures' | 'Funding' | 'ThirdParty';
    currency: string;
    amount: number;
  }) => {
    try {
      await transferFunds(data);
      // You might want to add a toast notification here for success
    } catch (err) {
      console.error("Transfer failed:", err);
      // You might want to add a toast notification here for error
    }
  };

  if (isLoading || !prices) {
    return (
      <div className={`w-full px-6 py-6 font-sans ${isDark ? 'bg-[#181a20]' : 'bg-white'}`}>
        <div className={`w-full px-6 py-6 rounded-lg border ${isDark ? 'bg-[#181a20] border-[#2b3139]' : 'bg-white border-[#eaecef]'}`}>
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full px-6 py-6 font-sans ${isDark ? 'bg-[#181a20]' : 'bg-white'}`}>
        <div className={`w-full px-6 py-6 rounded-lg border ${isDark ? 'bg-[#181a20] border-[#2b3139]' : 'bg-white border-[#eaecef]'}`}>
          <div className={`text-red-500 dark:text-red-400`}>
            Error loading wallet data: {(error as Error).message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full px-6 py-6 font-sans ${isDark ? 'bg-[#181a20]' : 'bg-white'}`}>
      <div className={`w-full px-6 py-6 rounded-lg border ${isDark ? 'bg-[#181a20] border-[#2b3139]' : 'bg-white border-[#eaecef]'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Estimated Balance
              </h2>
              <div 
                onClick={() => setHideBalance(!hideBalance)}
                className={`cursor-pointer transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {hideBalance ? <EyeOff size={16} /> : <Eye size={16} />}
              </div>
            </div>
            
            <div className="flex flex-wrap items-end gap-2 mb-2">
              <span className={`text-4xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {hideBalance ? "******" : balances[selectedCurrency].amount}
              </span>
              <div className="relative flex items-center">
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedCurrency}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform ${showDropdown ? 'rotate-180' : ''} ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                  />
                </div>
                
                {showDropdown && (
                  <div className={`absolute top-full left-0 mt-1 rounded-md shadow-lg z-10 min-w-[80px] border ${isDark ? 'bg-[#181a20] border-[#2b3139]' : 'bg-white border-[#eaecef]'}`}>
                    {currencies.map((currency) => (
                      <div
                        key={currency}
                        onClick={() => {
                          setSelectedCurrency(currency);
                          setShowDropdown(false);
                        }}
                        className={`block w-full px-2 py-2 text-left cursor-pointer text-sm font-semibold font-sans ${
                          isDark 
                            ? currency === selectedCurrency 
                              ? 'text-[#f0b90b] hover:bg-[#2b3139]' 
                              : 'text-gray-300 hover:bg-[#2b3139]'
                            : currency === selectedCurrency
                              ? 'text-[#f0b90b] hover:bg-gray-50'
                              : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {currency}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className={`text-sm text-left ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ≈ {hideBalance ? "******" : balances[selectedCurrency].usd}
              {walletData?.walletsOverview?.totalValueUSD && (
                <span className="ml-2">(Total: {hideBalance ? "******" : totalValueUSD})</span>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {["Deposit", "Withdraw"].map((label) => (
              <button
                key={label}
                className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors font-sans ${
                  isDark 
                    ? 'bg-[#2b3139] text-gray-300 hover:bg-[#3a424a] hover:text-white' 
                    : 'bg-[#eaecef] text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setShowTransferModal(true)}
              className={`px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors font-sans ${
                isDark 
                  ? 'bg-[#2b3139] text-gray-300 hover:bg-[#3a424a] hover:text-white' 
                  : 'bg-[#eaecef] text-gray-700 hover:bg-gray-200'
              }`}
            >
              Transfer
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <MyAssets wallets={walletData?.walletsOverview?.wallets || []} />
      </div>
      
      <div className="mt-6">
        <RecentTransactions />
      </div>

      {/* Transfer Modal */}
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        isDark={isDark}
        onTransfer={handleTransfer}
      />
    </div>
  );
}