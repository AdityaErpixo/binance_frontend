import React, { useState, useMemo } from "react";
import { FiInfo, FiSettings, FiCopy, FiX } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import { getWalletOverview } from "../../wallet-services/api";

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

interface FuturesAsset {
  symbol: string;
  icon: string;
  walletBalance: string;
  unrealizedPNL: string;
  marginBalance: string;
  availableForTransfer: string;
  hasTransfer: boolean;
}

const FuturesPage: React.FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<"USD-S-M" | "COIN-M">("USD-S-M");
  const [activeSection, setActiveSection] = useState<"Assets" | "Positions">("Assets");
  const [showNotification, setShowNotification] = useState(true);

  // Fetch wallet data
  const { data: walletData, isLoading, error } = useQuery<WalletOverviewResponse>({
    queryKey: ['walletOverview'],
    queryFn: getWalletOverview,
    refetchInterval: 30000,
  });

  // Process wallet data into futures assets
  const futuresAssets = useMemo<FuturesAsset[]>(() => {
    const defaultAssets = [
      { symbol: "BFUSD", icon: "🟡", hasTransfer: false },
      { symbol: "BNB", icon: "🟡", hasTransfer: true },
      { symbol: "BTC", icon: "🟠", hasTransfer: true },
      { symbol: "ETH", icon: "🔷", hasTransfer: true },
      { symbol: "FDUSD", icon: "🟢", hasTransfer: true },
      { symbol: "LDUSDT", icon: "🔵", hasTransfer: false },
      { symbol: "USDC", icon: "🔵", hasTransfer: true },
      { symbol: "USDT", icon: "🟢", hasTransfer: true },
    ];

    // Example prices - replace with real API calls
    const prices: Record<string, number> = {
      BTC: 50000,
      ETH: 2500,
      BNB: 600,
      USDT: 1,
      USDC: 1,
      FDUSD: 1,
      BFUSD: 1,
      LDUSDT: 1,
    };

    return defaultAssets.map(asset => {
      // Find all balances for this asset across wallets
      let totalBalance = 0;
      walletData?.walletsOverview?.wallets?.forEach(wallet => {
        wallet.balances.forEach(balance => {
          if (balance.currency === asset.symbol) {
            totalBalance += balance.balance;
          }
        });
      });

      const price = prices[asset.symbol] || 0;
      const usdValue = (totalBalance * price).toFixed(8);

      return {
        ...asset,
        walletBalance: totalBalance.toFixed(8),
        unrealizedPNL: "0.00000000", // Would come from positions API
        marginBalance: usdValue,
        availableForTransfer: usdValue,
      };
    });
  }, [walletData]);

  // Calculate totals
  const totalMarginBalance = useMemo(() => {
    return futuresAssets.reduce(
      (sum, asset) => sum + parseFloat(asset.marginBalance), 
      0
    ).toFixed(2);
  }, [futuresAssets]);

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

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="p-6">
          <div className={`p-4 rounded-lg ${isDark ? "bg-gray-800 text-red-400" : "bg-red-50 text-red-700"}`}>
            Error loading wallet data: {(error as Error).message}
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
            <span>In order to comply with our regulatory requirements, we kindly request additional details.</span>
            <button className={`font-medium ml-2 underline ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
              Start Now
            </button>
          </div>
          <button onClick={() => setShowNotification(false)}>
            <FiX className={isDark ? "text-gray-400" : "text-gray-500"} />
          </button>
        </div>
      )}

      <div className="p-6">
        {/* Header Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex space-x-8">
            {(["USD-S-M", "COIN-M"] as const).map((tab) => (
              <button
                key={tab}
                className={`text-lg font-medium pb-2 border-b-2 ${
                  activeTab === tab
                    ? `border-yellow-500 ${isDark ? "text-yellow-400" : "text-yellow-600"}`
                    : `border-transparent ${isDark ? "text-gray-400" : "text-gray-600"}`
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button className={`px-4 py-2 rounded-md text-sm font-medium ${
              isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100 border border-gray-300"
            }`}>
              Transfer
            </button>
            <button className={`px-4 py-2 rounded-md text-sm font-medium ${
              isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100 border border-gray-300"
            }`}>
              Swap
            </button>
            <button className={`px-4 py-2 rounded-md text-sm font-medium ${
              isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100 border border-gray-300"
            }`}>
              Buy Crypto
            </button>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Margin Balance Card */}
          <div className={`lg:col-span-2 rounded-lg p-6 border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <div className="flex items-center space-x-2 mb-6">
              <h2 className="text-lg font-semibold">Margin Balance</h2>
              <FiInfo className={isDark ? "text-gray-400" : "text-gray-500"} />
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-4xl font-bold">{totalMarginBalance}</span>
                <select className={`text-sm px-2 py-1 rounded border ${
                  isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                }`}>
                  <option>USDT</option>
                </select>
              </div>
              <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Today's Realized PnL <span className="text-green-500">+0.00 (+0.00%)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Wallet Balance</div>
                <div className="text-2xl font-semibold">{totalMarginBalance}</div>
              </div>
              <div>
                <div className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Unrealized PNL</div>
                <div className="text-2xl font-semibold">0.0000</div>
              </div>
            </div>
          </div>

          {/* Asset Allocation Card */}
          <div className={`rounded-lg p-6 border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Asset Allocation</h2>
              <div className="flex space-x-2">
                <button className={`p-1 rounded ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}>
                  <FiSettings className={isDark ? "text-gray-400" : "text-gray-500"} />
                </button>
                <button className={`p-1 rounded ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}>
                  <FiCopy className={isDark ? "text-gray-400" : "text-gray-500"} />
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center h-48">
              <div className="text-center">
                <div className={`w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                }`}>
                  <div className={`w-24 h-24 rounded-full ${
                    isDark ? "bg-gray-600" : "bg-gray-200"
                  }`} />
                </div>
                <div className={`flex items-center justify-center space-x-2 text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    isDark ? "bg-gray-600" : "bg-gray-400"
                  }`} />
                  <span>No asset</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assets Table */}
        <div className={`rounded-lg border overflow-hidden ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <div className={`p-6 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}>
            <div className="flex space-x-8">
              {(["Assets", "Positions"] as const).map((section) => (
                <button
                  key={section}
                  className={`text-sm pb-2 border-b-2 ${
                    activeSection === section
                      ? `border-yellow-500 ${isDark ? "text-yellow-400" : "text-yellow-600"}`
                      : `border-transparent ${isDark ? "text-gray-400" : "text-gray-600"}`
                  }`}
                  onClick={() => setActiveSection(section)}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Wallet Balance</th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Unrealized PNL</th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Margin Balance</th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Available</th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDark ? "divide-gray-700" : "divide-gray-200"
              }`}>
                {futuresAssets.map((asset) => (
                  <tr key={asset.symbol} className={`${
                    isDark ? "hover:bg-gray-750" : "hover:bg-gray-50"
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                          isDark ? "bg-gray-700" : "bg-gray-100"
                        }`}>
                          {asset.icon}
                        </div>
                        <span className="font-medium text-sm">{asset.symbol}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {asset.walletBalance}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {asset.unrealizedPNL}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {asset.marginBalance}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {asset.availableForTransfer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {asset.hasTransfer ? (
                        <button className={`font-medium ${
                          isDark ? "text-yellow-400" : "text-yellow-600"
                        }`}>
                          Transfer
                        </button>
                      ) : (
                        <span className={isDark ? "text-gray-500" : "text-gray-400"}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuturesPage;