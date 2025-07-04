import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import UserInfoBar from "./components/UserInfoBar";
import BalanceCard from "./components/BalanceCard";
import MarketsSection from "./components/MarketsSection";
import DiscoverAndAnnouncements from "./components/DiscoverAndAnnouncements";
import SquareSection from "./components/SquareSection";
import Footer from "./components/Footer";
import Overview from "./pages/Assets/Overview";
import Spot from "./pages/Assets/Spot";
import Margin from "./pages/Assets/Margin";
import TransactionHistory from "./pages/Orders/TransactionHistory";
import PaymentHistory from "./pages/Orders/PaymentHistory";
import TradingPage from "./pages/Trading/Trading";
import FuturesPage from "./pages/Assets/Futures";
import FundingPage from "./pages/Assets/Funding";
import BinanceSignup from "./pages/signup/signup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./pages/signin/signin";
import MarginPage from "./pages/Trading/Margin/Margin";
import BuySellCrypto from "./pages/BuySellCrypto/BuySellCrypto";

const queryClient = new QueryClient();

interface DummyPageProps {
  title: string;
}

const DummyPage: React.FC<DummyPageProps> = ({ title }) => (
  <div className="p-4">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
    <p className="text-gray-600 dark:text-gray-400">This is a dummy page for {title.toLowerCase()}.</p>
  </div>
);

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isTradingRoute = location.pathname === "/trading" || location.pathname === "/trading/margin" || location.pathname === "/buy-sell-crypto";
  const isAuthRoute = location.pathname === "/" || location.pathname === "/signin";
  const mainContentClass = isTradingRoute || isAuthRoute ? "" : "lg:pl-64";

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-[#181a20] transition-colors duration-200">
        {!isTradingRoute && !isAuthRoute && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        <div className={mainContentClass}>
          {!isAuthRoute && <Header onMenuClick={() => setSidebarOpen(true)} />}

          <Routes>
            { /*<Route
              path="/"
              element={
                <main className="p-4 space-y-4">
                  <UserInfoBar />
                  <BalanceCard />
                  <MarketsSection />
                  <DiscoverAndAnnouncements />
                  <SquareSection />
                </main>
              }
            />*/ }
            <Route
              path="/"
              element={
                <BinanceSignup />
              }
            />

            <Route
              path="/dashboard"
              element={
                <main className="p-4 space-y-4">
                  <UserInfoBar />
                  <BalanceCard />
                  <MarketsSection />
                  <DiscoverAndAnnouncements />
                  <SquareSection />
                </main>
              }
            />

            {/* Assets Routes */}
            <Route path="/assets/overview" element={<Overview />} />
            <Route path="/assets/spot" element={<Spot />} />
            <Route path="/assets/margin" element={<Margin />} />
            <Route path="/assets/funding" element={<FundingPage />} />
            <Route path="/assets/futures" element={<FuturesPage />} />
            <Route path="/assets" element={<Overview />} />

            {/* Orders Routes */}
            <Route path="/orders/transactionhistory" element={<TransactionHistory />} />
            <Route path="/orders/paymenthistory" element={<PaymentHistory />} />
            <Route path="/orders/*" element={<DummyPage title="Orders" />} />

            {/* Other routes */}
            <Route path="/rewards" element={<DummyPage title="Rewards Hub" />} />
            <Route path="/referral" element={<DummyPage title="Referral" />} />
            <Route path="/account/*" element={<DummyPage title="Account" />} />
            <Route path="/sub-accounts" element={<DummyPage title="Sub Accounts" />} />
            <Route path="/settings" element={<DummyPage title="Settings" />} />
            <Route path="/trading" element={<TradingPage />} />
            <Route path="/trading/margin" element={<MarginPage />} />
            <Route path="/signin" element={<LoginPage />} />

            <Route path="/buy-sell-crypto" element={<BuySellCrypto />} />
          </Routes>

          {!isAuthRoute && <Footer />}
        </div>
      </div>
    </ThemeProvider>
  );
};

const AppWithRouter: React.FC = () => (
  <Router>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Router>
);

export default AppWithRouter;