import React, { useState, useEffect, useMemo } from "react";
import { FiSearch, FiMoreHorizontal, FiX, FiInfo, FiEye, FiEyeOff, FiChevronDown } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getWalletOverview, transferFunds } from "../../wallet-services/api";
import TransferModal from "../../components/Transfer";
import { fetchCryptoPrices } from "../../services/FetchData";

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

interface Asset {
  currency: string;
  balance: number;
  walletType: string;
  icon: string;
  actions: string[];
}

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  actions: string[];
  onActionClick: (action: string) => void;
  isDark: boolean;
}

interface TransferInput {
  fromType: 'Spot' | 'Margin' | 'Futures' | 'Funding' | 'ThirdParty';
  toType: 'Spot' | 'Margin' | 'Futures' | 'Funding' | 'ThirdParty';
  currency: string;
  amount: number;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ isOpen, onClose, actions, onActionClick, isDark }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div
        className={`absolute right-0 top-8 z-40 w-40 rounded-lg border shadow-lg ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => {
              onActionClick(action);
              onClose();
            }}
            className={`w-full px-4 py-2 text-left text-sm ${
              isDark
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {action}
          </button>
        ))}
      </div>
    </>
  );
};

const FundingPage: React.FC = () => {
  const { isDark } = useTheme();
  const [hideSmallAssets, setHideSmallAssets] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Fetch wallet data
  const { 
    data: walletData, 
    isLoading, 
    error: fetchError,
    refetch
  } = useQuery<WalletOverviewResponse>({
    queryKey: ['walletOverview'],
    queryFn: getWalletOverview,
    refetchInterval: 30000,
  });


  // Add this with your other hooks
const { data: prices } = useQuery({
  queryKey: ['cryptoPrices'],
  queryFn: fetchCryptoPrices,
  refetchInterval: 60000, // Refresh every minute
});

  // Transfer mutation
  const transferMutation = useMutation({
    mutationFn: transferFunds,
    onSuccess: () => {
      refetch(); // Refresh wallet data after successful transfer
    },
  });

  // Process wallet data into assets with icons
 // Process wallet data into assets with icons (Funding only)
const assets = useMemo<Asset[]>(() => {
  if (!walletData?.walletsOverview?.wallets) return [];

  const iconMap: Record<string, string> = {
    BTC: "🟠",
    ETH: "🔷",
    BNB: "🟡",
    USDT: "🟢",
    USDC: "🔵",
    FDUSD: "🟢",
  };

  // Filter for Funding wallets only
  const fundingWallets = walletData.walletsOverview.wallets.filter(
    wallet => wallet.type === 'Funding'
  );

  // Flatten balances from Funding wallets only
  const allBalances: Asset[] = [];
  fundingWallets.forEach(wallet => {
    wallet.balances.forEach(balance => {
      allBalances.push({
        currency: balance.currency,
        balance: balance.balance,
        walletType: wallet.type,
        icon: iconMap[balance.currency] || "🟣",
        actions: ["Deposit", "Withdraw", "Transfer"],
      });
    });
  });

  return allBalances;
}, [walletData]);

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.currency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !hideSmallAssets || asset.balance >= 1;
    return matchesSearch && matchesFilter;
  });

  const [selectedCurrency, setSelectedCurrency] = useState<'USDT' | 'BTC'>('USDT');

const totalBalance = useMemo(() => {
  const balance = assets
    .filter(asset => asset.currency === selectedCurrency && asset.walletType === 'Funding')
    .reduce((sum, asset) => sum + asset.balance, 0);
    
  // Use real prices for conversion
  const price = prices?.[selectedCurrency] || 1;
  return {
    amount: balance.toFixed(selectedCurrency === 'BTC' ? 8 : 2),
    usd: (balance * price).toFixed(2)
  };
}, [assets, selectedCurrency, prices]);

const handleActionClick = (action: string, asset: Asset) => {
  if (action === "Transfer") {
    setSelectedAsset({
      ...asset,
      walletType: 'Funding' // Ensure walletType is Funding
    });
    setShowTransferModal(true);
  }
  // Handle other actions (Deposit, Withdraw) here
};

  const handleTransfer = async (data: TransferInput) => {
    await transferMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="p-6">
          <div className={`p-4 rounded-lg ${
            isDark ? "bg-gray-800 text-red-400" : "bg-red-50 text-red-700"
          }`}>
            Error loading wallet data: {(fetchError as Error).message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* Notification Bar */}
      {showNotification && (
        <div className={`px-4 py-2.5 flex items-center justify-between text-sm ${
          isDark ? "bg-gray-800 border-b border-gray-700" : "bg-blue-50 border-b border-blue-200"
        }`}>
          <div className="flex items-center space-x-2">
            <FiInfo className={isDark ? "text-blue-400" : "text-blue-600"} />
            <span>In order to comply with regulatory requirements, we kindly request additional details.</span>
            <button className={`ml-2 underline ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
              Start Now
            </button>
          </div>
          <button onClick={() => setShowNotification(false)}>
            <FiX className={isDark ? "text-gray-400" : "text-gray-500"} />
          </button>
        </div>
      )}

      <div className="p-4 sm:p-6">
        {/* Balance Card */}
        <div className={`rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Estimated Balance
                </h2>
                <button onClick={() => setShowBalance(!showBalance)}>
                  {showBalance ? (
                    <FiEye className={isDark ? "text-gray-400" : "text-gray-500"} />
                  ) : (
                    <FiEyeOff className={isDark ? "text-gray-400" : "text-gray-500"} />
                  )}
                </button>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl sm:text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {showBalance ? totalBalance.amount : "****"}
                </span>
                <select 
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value as 'USDT' | 'BTC')}
                  className={`text-sm px-2 py-1 rounded border ${
                    isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                  }`}
                >
                  <option value="USDT">USDT</option>
                  <option value="BTC">BTC</option>
                </select>
              </div>
              <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                ≈ {showBalance ? `$${totalBalance.usd}` : "****"}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded text-sm font-medium">
                Deposit
              </button>
              <button className={`px-4 py-2 rounded text-sm font-medium border ${
                isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
              }`}>
                Withdraw
              </button>
              <button 
                onClick={() => setShowTransferModal(true)}
                className={`px-4 py-2 rounded text-sm font-medium border ${
                  isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                }`}
              >
                Transfer
              </button>
            </div>
          </div>
        </div>

        {/* Assets Table */}
        <div className={`rounded-lg border overflow-hidden ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <div className={`p-4 sm:p-6 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Funding</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`} />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded border text-sm w-full ${
                      isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                    }`}
                  />
                </div>
                <label className={`flex items-center gap-2 text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  <input
                    type="checkbox"
                    checked={hideSmallAssets}
                    onChange={(e) => setHideSmallAssets(e.target.checked)}
                    className={`rounded ${
                      isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                    }`}
                  />
                  Hide small assets
                </label>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}>
                  <th className={`px-6 py-4 text-left text-xs font-medium uppercase ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}>Coin</th>
                  <th className={`px-6 py-4 text-right text-xs font-medium uppercase ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}>Amount</th>
                  <th className={`px-6 py-4 text-right text-xs font-medium uppercase ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}>Available</th>
                  <th className={`px-6 py-4 text-right text-xs font-medium uppercase ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}>Frozen</th>
                  <th className={`px-6 py-4 text-right text-xs font-medium uppercase ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}>Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDark ? "divide-gray-700" : "divide-gray-200"
              }`}>
                {filteredAssets.map((asset, index) => (
                  <tr key={index} className={`${
                    isDark ? "hover:bg-gray-750" : "hover:bg-gray-50"
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                          isDark ? "bg-gray-700" : "bg-gray-100"
                        }`}>
                          {asset.icon}
                        </div>
                        <div>
                          <div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                            {asset.currency}
                          </div>
                          <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            {asset.walletType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`${isDark ? "text-white" : "text-gray-900"}`}>
                        {showBalance ? asset.balance.toFixed(8) : "****"}
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {showBalance ? asset.balance.toFixed(8) : "****"}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}>
                      {showBalance ? "0.00000000" : "****"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        {asset.actions.slice(0, 2).map((action) => (
                          <button
                            key={action}
                            className={`text-sm font-medium ${
                              isDark ? "text-yellow-400" : "text-yellow-600"
                            }`}
                          >
                            {action}
                          </button>
                        ))}
                        <div className="relative">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                            className={`p-1 rounded ${
                              isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                            }`}
                          >
                            <FiMoreHorizontal className="w-4 h-4" />
                          </button>
                          <DropdownMenu
                            isOpen={openDropdown === index}
                            onClose={() => setOpenDropdown(null)}
                            actions={["Deposit", "Withdraw", "Transfer"]}
                            onActionClick={(action) => handleActionClick(action, asset)}
                            isDark={isDark}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile List */}
          <div className="lg:hidden divide-y">
            {filteredAssets.map((asset, index) => (
              <div key={index} className={`p-4 ${
                isDark ? "hover:bg-gray-750" : "hover:bg-gray-50"
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    }`}>
                      {asset.icon}
                    </div>
                    <div>
                      <div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                        {asset.currency}
                      </div>
                      <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {asset.walletType}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                      className={`p-2 rounded ${
                        isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <FiMoreHorizontal className="w-5 h-5" />
                    </button>
                    <DropdownMenu
                      isOpen={openDropdown === index}
                      onClose={() => setOpenDropdown(null)}
                      actions={["Deposit", "Withdraw", "Transfer"]}
                      onActionClick={(action) => handleActionClick(action, asset)}
                      isDark={isDark}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Amount</div>
                    <div className={`${isDark ? "text-white" : "text-gray-900"}`}>
                      {showBalance ? asset.balance.toFixed(8) : "****"}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Available</div>
                    <div className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {showBalance ? asset.balance.toFixed(8) : "****"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {asset.actions.map((action) => (
                    <button
                      key={action}
                      className={`px-3 py-1.5 rounded text-xs font-medium ${
                        isDark ? "bg-gray-700 text-yellow-400" : "bg-gray-100 text-yellow-600"
                      }`}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <div className="p-8 text-center">
              <div className={`text-lg font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                No assets found
              </div>
              <div className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                Try adjusting your search or filter criteria
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transfer Modal */}
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        isDark={isDark}
        asset={selectedAsset || undefined}
        onTransfer={handleTransfer}
      />
    </div>
  );
};

export default FundingPage;