
import React from "react"
import { useState } from "react"

const SquareSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("News")

  const newsData = [
    {
      time: "1 hours ago",
      title: "Meta Platforms Shareholders Reject Bitcoin Financial Assessment Proposal",
      content:
        "According to Foresight News, Phoenix reports that Meta Platforms shareholders have voted against a proposal for a financial assessment of Bitcoin. The decision reflects the company's stance on cryptocurrency evaluations and its approach to digital asset management...",
    },
    {
      time: "2 hours ago",
      title: "Bitcoin Mining Difficulty Reaches Record High with 4.38% Increase",
      content:
        "According to BlockBeats, data from BTC.com indicates that Bitcoin mining difficulty has been adjusted at block height 899,136, with an increase of 4.38% to reach 126.98 T, marking a new historical high. As of now, the average network hash rate over the past seven days stands at...",
    },
    {
      time: "3 hours ago",
      title:
        "The exposure of mnemonic phrases. A user had four mnemonic phrases leaked, leading to the theft of funds from four corresponding wallet addresses. The hacker converted the stolen assets...",
      content: "",
    },
  ]

  const suggestedData = [
    {
      time: "Just now",
      title: "Binance Launches New Staking Program with 15% APY on Selected Tokens",
      content:
        "Binance has announced a new high-yield staking program offering up to 15% APY on selected tokens. The program aims to incentivize long-term holding while providing passive income opportunities for users...",
    },
    {
      time: "2 hours ago",
      title: "New Trading Competition: Win a Share of $100,000 USDT Prize Pool",
      content:
        "Join our latest trading competition and compete for a share of the $100,000 USDT prize pool. The competition runs for two weeks and rewards the top 100 traders based on trading volume and profit percentage...",
    },
  ]

  const currentData = activeTab === "News" ? newsData : suggestedData

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Square</h2>
          <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            More →
          </button>
        </div>

        <div className="flex space-x-6 mb-4">
          <button
            onClick={() => setActiveTab("News")}
            className={`text-sm pb-2 border-b-2 transition-colors ${
              activeTab === "News"
                ? "border-yellow-500 text-yellow-500"
                : "border-transparent text-gray-500 dark:text-gray-400"
            }`}
          >
            News
          </button>
          <button
            onClick={() => setActiveTab("Suggested to You")}
            className={`text-sm pb-2 border-b-2 transition-colors ${
              activeTab === "Suggested to You"
                ? "border-yellow-500 text-yellow-500"
                : "border-transparent text-gray-500 dark:text-gray-400"
            }`}
          >
            Suggested to You
          </button>
        </div>

        {activeTab === "News" && (
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Trending topic:</div>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                #CryptoXAI101
              </span>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                #TradingTipsAI101
              </span>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                #MarketPulseAI
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {currentData.map((news, index) => (
          <div
            key={index}
            className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 hover:border-yellow-500 transition-colors"
          >
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{news.time}</div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 leading-relaxed">{news.title}</h3>
            {news.content && <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{news.content}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SquareSection
