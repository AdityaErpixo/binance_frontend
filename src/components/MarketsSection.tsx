
import  React from "react"
import { useState } from "react"

const MarketsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Hot")

  const tabs = ["Holding", "Hot", "New Listing", "Favorite", "Top Gainers", "24h Volume"]

  // Different data for each tab
  const tabData = {
    Holding: [
      {
        symbol: "BTC",
        name: "Bitcoin",
        price: "106,994",
        volume: "$106,994",
        change: "-1.4%",
        changeColor: "text-red-500",
        icon: "🟠",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        price: "3,542",
        volume: "$3,542",
        change: "-2.1%",
        changeColor: "text-red-500",
        icon: "🔷",
      },
      {
        symbol: "BNB",
        name: "BNB",
        price: "673.4",
        volume: "$673.4",
        change: "-1.37%",
        changeColor: "text-red-500",
        icon: "🟡",
      },
    ],
    Hot: [
      {
        symbol: "AAVE",
        name: "Aave",
        price: "253.9",
        volume: "$253.9k",
        change: "-5.52%",
        changeColor: "text-red-500",
        icon: "🟣",
      },
      {
        symbol: "AUA",
        name: "AUA",
        price: "0.71",
        volume: "$0.71",
        change: "-5.36%",
        changeColor: "text-red-500",
        icon: "🔵",
      },
      {
        symbol: "AVAX",
        name: "Avalanche",
        price: "21.7",
        volume: "$21.7",
        change: "-7.73%",
        changeColor: "text-red-500",
        icon: "🔴",
      },
      {
        symbol: "BNB",
        name: "BNB",
        price: "673.4",
        volume: "$673.4",
        change: "-1.37%",
        changeColor: "text-red-500",
        icon: "🟡",
      },
      {
        symbol: "BTC",
        name: "Bitcoin",
        price: "106,994",
        volume: "$106,994",
        change: "-1.4%",
        changeColor: "text-red-500",
        icon: "🟠",
      },
    ],
    "New Listing": [
      {
        symbol: "PIXEL",
        name: "Pixels",
        price: "0.0432",
        volume: "$1.2M",
        change: "+24.5%",
        changeColor: "text-green-500",
        icon: "🟢",
      },
      {
        symbol: "MEME",
        name: "Memecoin",
        price: "0.0021",
        volume: "$890K",
        change: "+18.7%",
        changeColor: "text-green-500",
        icon: "🟣",
      },
      {
        symbol: "EDGE",
        name: "LayerEdge",
        price: "1.45",
        volume: "$3.2M",
        change: "+12.3%",
        changeColor: "text-green-500",
        icon: "🔵",
      },
    ],
    Favorite: [
      {
        symbol: "BTC",
        name: "Bitcoin",
        price: "106,994",
        volume: "$106,994",
        change: "-1.4%",
        changeColor: "text-red-500",
        icon: "🟠",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        price: "3,542",
        volume: "$3,542",
        change: "-2.1%",
        changeColor: "text-red-500",
        icon: "🔷",
      },
    ],
    "Top Gainers": [
      {
        symbol: "PIXEL",
        name: "Pixels",
        price: "0.0432",
        volume: "$1.2M",
        change: "+24.5%",
        changeColor: "text-green-500",
        icon: "🟢",
      },
      {
        symbol: "MEME",
        name: "Memecoin",
        price: "0.0021",
        volume: "$890K",
        change: "+18.7%",
        changeColor: "text-green-500",
        icon: "🟣",
      },
      {
        symbol: "EDGE",
        name: "LayerEdge",
        price: "1.45",
        volume: "$3.2M",
        change: "+12.3%",
        changeColor: "text-green-500",
        icon: "🔵",
      },
    ],
    "24h Volume": [
      {
        symbol: "BTC",
        name: "Bitcoin",
        price: "106,994",
        volume: "$24.5B",
        change: "-1.4%",
        changeColor: "text-red-500",
        icon: "🟠",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        price: "3,542",
        volume: "$12.8B",
        change: "-2.1%",
        changeColor: "text-red-500",
        icon: "🔷",
      },
      {
        symbol: "USDT",
        name: "Tether",
        price: "1.00",
        volume: "$8.7B",
        change: "+0.01%",
        changeColor: "text-green-500",
        icon: "🟢",
      },
    ],
  }

  const currentData = tabData[activeTab as keyof typeof tabData] || tabData["Hot"]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Markets</h2>
          <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            More →
          </button>
        </div>

        <div className="flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm pb-2 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "border-yellow-500 text-yellow-500"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
          <div>Coin</div>
          <div className="text-right">Last Price</div>
          <div className="text-right">24h Change</div>
          <div className="text-right">Trade</div>
        </div>

        <div className="space-y-3">
          {currentData.map((coin, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 items-center py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg">
                  {coin.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{coin.symbol}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{coin.name}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold text-gray-900 dark:text-white">{coin.price}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{coin.volume}</div>
              </div>

              <div className={`text-right font-medium ${coin.changeColor}`}>{coin.change}</div>

              <div className="text-right">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-1.5 rounded text-xs font-medium transition-colors">
                  Trade
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarketsSection
