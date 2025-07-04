import  React from "react"

const UserInfoBar: React.FC = () => {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
          <img src="/placeholder.svg?height=48&width=48" alt="User Avatar" className="w-10 h-10 rounded-full" />
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">User-24067</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Email: 6164a7f10@.g</div>
        </div>
      </div>

      <div className="flex items-center space-x-8">
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">VIP Level</div>
          <div className="text-sm font-medium text-yellow-500">Regular User</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Referrals</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">0</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Rewards</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">0</div>
        </div>
      </div>
    </div>
  )
}

export default UserInfoBar
