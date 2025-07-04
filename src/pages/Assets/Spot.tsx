import { useState } from "react";
import { ChevronDown, Eye, EyeOff, ChevronRight, MoreVertical } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Spott from "../../components/Spot";
import { useQuery } from "@tanstack/react-query";
import { fetchCryptoPrices } from "../../services/FetchData";
import { getSpotWallet, transferFunds } from "../../wallet-services/api";
import TransferModal from "../../components/Transfer";

interface WalletBalance {
  balance: number;
  currency: string;
}

interface WalletOverviewResponse {
  walletByType: {
    balances: WalletBalance[];
  };
}

type Currency = "BTC" | "ETH" | "BNB" | "USDT";

export default function Spot() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("ETH");
  const [showDropdown, setShowDropdown] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const { isDark } = useTheme();

  // Fetch prices
  const { data: prices } = useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: fetchCryptoPrices,
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch SPOT wallet data
  const { data: walletData, isLoading, error } = useQuery<WalletOverviewResponse>({
    queryKey: ['Spot'],
    queryFn: getSpotWallet,
    refetchInterval: 30000,
  });

  // Handle transfer
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

  // Calculate balances with real prices
  const calculateBalances = () => {
    const balances = {
      BTC: { amount: "0.00", usd: "$0.00" },
      ETH: { amount: "0.00", usd: "$0.00" },
      BNB: { amount: "0.00", usd: "$0.00" },
      USDT: { amount: "0.00", usd: "$0.00" },
    };

    walletData?.walletByType?.balances?.forEach(balance => {
      const currency = balance.currency as Currency;
      const price = prices?.[currency] || 0;
      balances[currency] = {
        amount: balance.balance.toFixed(8),
        usd: `$${(balance.balance * price).toFixed(2)}`,
      };
    });

    return balances;
  };

  const balances = calculateBalances();
  const totalValueUSD = Object.entries(balances).reduce((total, [currency, { amount }]) => {
    const price = prices?.[currency as Currency] || 0;
    return total + parseFloat(amount) * price;
  }, 0).toFixed(2);

  if (isLoading || !prices) return <LoadingSkeleton isDark={isDark} />;
  if (error) return <ErrorDisplay error={error} isDark={isDark} />;

  return (
    <div className={`w-full px-6 py-6 font-sans ${isDark ? 'bg-[#181a20]' : 'bg-white'}`}>
      <div className={`w-full px-6 py-6 rounded-lg border ${isDark ? 'bg-[#181a20] border-[#2b3139]' : 'bg-white border-[#eaecef]'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <BalanceSection 
            isDark={isDark}
            hideBalance={hideBalance}
            selectedCurrency={selectedCurrency}
            balances={balances}
            totalValueUSD={totalValueUSD}
            onToggleHide={() => setHideBalance(!hideBalance)}
            onCurrencyChange={setSelectedCurrency}
          />
          
          <ActionButtons 
            isDark={isDark}
            showMoreOptions={showMoreOptions}
            onMoreOptionsToggle={setShowMoreOptions}
            onTransferClick={() => setShowTransferModal(true)}
          />
        </div>
      </div>
      <div className="mt-5">
        <Spott walletData={walletData?.walletByType?.balances || []} />
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

// Sub-components for better organization
const LoadingSkeleton = ({ isDark }: { isDark: boolean }) => (
  <div className={`w-full px-6 py-6 font-sans ${isDark ? 'bg-[#181a20]' : 'bg-white'}`}>
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-12 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

const ErrorDisplay = ({ error, isDark }: { error: Error, isDark: boolean }) => (
  <div className={`w-full px-6 py-6 font-sans ${isDark ? 'bg-[#181a20]' : 'bg-white'}`}>
    <div className={`text-red-500 dark:text-red-400`}>
      Error loading spot wallet data: {error.message}
    </div>
  </div>
);

const BalanceSection = ({ 
  isDark, hideBalance, selectedCurrency, balances, totalValueUSD, onToggleHide, onCurrencyChange 
}: any) => (
  <div className="flex-1">
    <div className="flex items-center gap-2 mb-4">
      <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Spot Balance
      </h2>
      <div onClick={onToggleHide} className={`cursor-pointer ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        {hideBalance ? <EyeOff size={16} /> : <Eye size={16} />}
      </div>
    </div>
    
    <div className="flex items-end gap-2 mb-2">
      <span className={`text-4xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {hideBalance ? "******" : balances[selectedCurrency].amount}
      </span>
      <CurrencyDropdown 
        isDark={isDark}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={onCurrencyChange}
      />
    </div>
    
    <div className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
      ≈ {hideBalance ? "******" : balances[selectedCurrency].usd}
      <span className="ml-2">(Total: {hideBalance ? "******" : `$${totalValueUSD}`})</span>
    </div>
  </div>
);

const CurrencyDropdown = ({ isDark, selectedCurrency, onCurrencyChange }: any) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const currencies: Currency[] = ["BTC", "ETH", "BNB", "USDT"];

  return (
    <div className="relative flex items-center">
      <div onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-1 cursor-pointer">
        <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {selectedCurrency}
        </span>
        <ChevronDown size={16} className={`${isDark ? 'text-gray-500' : 'text-gray-500'} ${showDropdown ? 'rotate-180' : ''}`} />
      </div>
      
      {showDropdown && (
        <div className={`absolute top-full left-0 mt-1 rounded-md shadow-lg z-10 min-w-[80px] border ${isDark ? 'bg-[#181a20] border-[#2b3139]' : 'bg-white border-[#eaecef]'}`}>
          {currencies.map(currency => (
            <div
              key={currency}
              onClick={() => {
                onCurrencyChange(currency);
                setShowDropdown(false);
              }}
              className={`block w-full px-2 py-2 text-left cursor-pointer text-sm font-semibold ${
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
  );
};

const ActionButtons = ({ isDark, showMoreOptions, onMoreOptionsToggle, onTransferClick }: any) => (
  <div className="flex items-center gap-3">
    <div className="flex gap-3">
      {["Deposit", "Withdraw"].map(label => (
        <button
          key={label}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            isDark 
              ? 'bg-[#2b3139] text-gray-300 hover:bg-[#3a424a]' 
              : 'bg-[#eaecef] text-gray-700 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
      <button
        onClick={onTransferClick}
        className={`px-4 py-2 text-sm font-medium rounded-md ${
          isDark 
            ? 'bg-[#2b3139] text-gray-300 hover:bg-[#3a424a]' 
            : 'bg-[#eaecef] text-gray-700 hover:bg-gray-200'
        }`}
      >
        Transfer
      </button>
    </div>
    
    <div className="relative" onMouseEnter={() => onMoreOptionsToggle(true)} onMouseLeave={() => onMoreOptionsToggle(false)}>
      <button className={`p-2 rounded-md ${isDark ? 'text-gray-400 hover:text-[#fcd535]' : 'text-gray-500 hover:text-[#fcd535]'}`}>
        <MoreVertical size={20} />
      </button>
      
      {showMoreOptions && (
        <div className={`absolute top-full right-0 mt-1 rounded-lg shadow-lg z-10 min-w-[180px] border ${isDark ? 'bg-[#181a20] border-[#2b3139]' : 'bg-white border-[#eaecef]'}`}>
          {["Send", "Transaction History"].map(item => (
            <div key={item} className={`block w-full px-4 py-3 text-left cursor-pointer text-sm font-medium ${
              isDark ? 'text-gray-300 hover:bg-black' : 'text-gray-700 hover:bg-[#fafafa]'
            }`}>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);