import  React from "react"
import BalanceCard from "./BalanceCard"
import MarketsSection from "./MarketsSection"
import DiscoverSection from "./DiscoverSection"
import SquareSection from "./SquareSection"
import AnnouncementsSection from "./AnnouncementsSection"

const Dashboard: React.FC = () => {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <BalanceCard />
          <MarketsSection />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DiscoverSection />
            <SquareSection />
          </div>
        </div>
        <div className="xl:col-span-1">
          <AnnouncementsSection />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
