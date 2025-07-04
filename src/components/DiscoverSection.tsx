
import  React from "react"
import { useState } from "react"

const DiscoverSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Earn")

  const earnData = [
    { symbol: "USDC", apy: "10.82%", duration: "10.82%", type: "Flexible", color: "bg-blue-500" },
    { symbol: "USDT", apy: "7.61%", duration: "7.61%", type: "Flexible", color: "bg-green-500" },
    { symbol: "SOL", apy: "1.59%", duration: "76.14%", type: "Flexible / Fixed", color: "bg-purple-500" },
    { symbol: "ETH", apy: "2.68%", duration: "149.98%", type: "Flexible", color: "bg-blue-600" },
    { symbol: "BNB", apy: "6.14%", duration: "6.63%", type: "Flexible / Fixed", color: "bg-yellow-500" },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Discover</h2>
          <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            More →
          </button>
        </div>
        <div className="flex space-x-6 mt-4">
          <button
            onClick={() => setActiveTab("Earn")}
            className={`text-sm pb-2 border-b-2 ${
              activeTab === "Earn"
                ? "border-yellow-500 text-yellow-500"
                : "border-transparent text-gray-500 dark:text-gray-400"
            }`}
          >
            Earn
          </button>
          <button
            onClick={() => setActiveTab("Copy Trading")}
            className={`text-sm pb-2 border-b-2 ${
              activeTab === "Copy Trading"
                ? "border-yellow-500 text-yellow-500"
                : "border-transparent text-gray-500 dark:text-gray-400"
            }`}
          >
            Copy Trading
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Simple & Secure. Search popular coins and start earning.
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <div>Coin</div>
          <div className="text-right">Est APR</div>
          <div className="text-right">Duration</div>
          <div className="text-right">Action</div>
        </div>

        <div className="space-y-3">
          {earnData.map((coin, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center py-2">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full ${coin.color} flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{coin.symbol.charAt(0)}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white text-sm">{coin.symbol}</span>
              </div>
              <div className="text-right text-green-500 font-medium">{coin.apy}</div>
              <div className="text-right text-gray-600 dark:text-gray-400 text-sm">{coin.type}</div>
              <div className="text-right">
                <button className="bg-yellow-500 text-black px-3 py-1 rounded text-xs font-medium">Subscribe</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DiscoverSection
