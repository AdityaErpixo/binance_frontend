
import  React from "react"
import { useState } from "react"

const DiscoverAndAnnouncements: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Earn")

  // Different data for each tab
  const tabData = {
    Earn: [
      {
        symbol: "USDC",
        apy: "10.82%",
        duration: "10.82%",
        type: "Flexible",
        icon: "🔵",
      },
      {
        symbol: "USDT",
        apy: "7.61%",
        duration: "7.61%",
        type: "Flexible",
        icon: "🟢",
      },
      {
        symbol: "SOL",
        apy: "1.59%",
        duration: "76.14%",
        type: "Flexible / Fixed",
        icon: "🟣",
      },
      {
        symbol: "ETH",
        apy: "2.68%",
        duration: "149.98%",
        type: "Flexible",
        icon: "🔷",
      },
      {
        symbol: "BNB",
        apy: "6.14%",
        duration: "6.63%",
        type: "Flexible / Fixed",
        icon: "🟡",
      },
    ],
    "Copy Trading": [
      {
        symbol: "BTC Trader",
        apy: "124.5%",
        duration: "1 Year",
        type: "Copy",
        icon: "👤",
      },
      {
        symbol: "Crypto Whale",
        apy: "87.2%",
        duration: "6 Months",
        type: "Copy",
        icon: "🐋",
      },
      {
        symbol: "DeFi Master",
        apy: "65.3%",
        duration: "3 Months",
        type: "Copy",
        icon: "🧙",
      },
      {
        symbol: "Altcoin Pro",
        apy: "112.8%",
        duration: "1 Year",
        type: "Copy",
        icon: "🚀",
      },
    ],
  }

  const currentData = tabData[activeTab as keyof typeof tabData]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Discover Section */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Discover</h2>
            <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              More →
            </button>
          </div>

          <div className="flex space-x-6 mb-3">
            <button
              onClick={() => setActiveTab("Earn")}
              className={`text-sm pb-2 border-b-2 transition-colors ${
                activeTab === "Earn"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-transparent text-gray-500 dark:text-gray-400"
              }`}
            >
              Earn
            </button>
            <button
              onClick={() => setActiveTab("Copy Trading")}
              className={`text-sm pb-2 border-b-2 transition-colors ${
                activeTab === "Copy Trading"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-transparent text-gray-500 dark:text-gray-400"
              }`}
            >
              Copy Trading
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Simple & Secure. Search popular coins and start earning.
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
            <div>Coin</div>
            <div className="text-right">Est APR</div>
            <div className="text-right">Duration</div>
            <div className="text-right">Action</div>
          </div>

          <div className="space-y-3">
            {currentData.map((coin, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 items-center py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm">
                    {coin.icon}
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{coin.symbol}</span>
                </div>

                <div className="text-right text-green-500 font-semibold">{coin.apy}</div>
                <div className="text-right text-gray-600 dark:text-gray-400 text-sm">{coin.type}</div>

                <div className="text-right">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1.5 rounded text-xs font-medium transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Announcements</h2>
            <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              More →
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-4 text-black mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm mb-1">Trade crypto with advanced tools</h3>
                <div className="text-xs space-x-2">
                  <span className="font-bold">BTC/USDT</span>
                  <span>$106,994</span>
                  <span className="text-red-600">-1.4%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-yellow-300 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm">- - -</div>
        </div>
      </div>
    </div>
  )
}

export default DiscoverAndAnnouncements
