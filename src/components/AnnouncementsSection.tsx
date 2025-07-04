import  React from "react"

const AnnouncementsSection: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Announcements</h2>
          <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            More →
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-4 text-black">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-sm">Trade crypto with advanced tools</h3>
              <div className="text-xs mt-1">
                <span className="font-bold">BTC/USDT</span>
                <span className="ml-2">$106,994</span>
                <span className="ml-2 text-red-600">-1.4%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-yellow-300 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">- - -</div>
      </div>
    </div>
  )
}

export default AnnouncementsSection
