
import React from "react"
import { FiTwitter, FiGithub, FiInstagram, FiYoutube, FiGlobe, FiDollarSign } from "react-icons/fi"
import { FaTelegramPlane, FaRedditAlien, FaDiscord, FaFacebookF, FaWhatsapp, FaEllipsisH } from "react-icons/fa"
import { SiX } from "react-icons/si"
import { useTheme } from "../context/ThemeContext"

const Footer: React.FC = () => {
  const { isDark, toggleTheme } = useTheme()

  const footerSections = [
    {
      title: "Community",
      links: [],
      socialIcons: [
        { icon: FiTwitter, label: "Twitter" },
        { icon: FaTelegramPlane, label: "Telegram" },
        { icon: FaRedditAlien, label: "Reddit" },
        { icon: FaFacebookF, label: "Facebook" },
        { icon: SiX, label: "X" },
        { icon: FiGithub, label: "GitHub" },
        { icon: FiInstagram, label: "Instagram" },
        { icon: FaDiscord, label: "Discord" },
        { icon: FiYoutube, label: "YouTube" },
        { icon: FaWhatsapp, label: "WhatsApp" },
        { icon: FaEllipsisH, label: "More" },
      ],
    },
    {
      title: "About Us",
      links: [
        "About",
        "Careers",
        "Announcements",
        "News",
        "Press",
        "Legal",
        "Terms",
        "Privacy",
        "Building Trust",
        "Blog",
        "Community",
        "Risk Warning",
        "Notices",
        "Downloads",
        "Desktop Application",
      ],
    },
    {
      title: "Products",
      links: [
        "Exchange",
        "Buy Crypto",
        "Pay",
        "Academy",
        "Live",
        "Tax",
        "Gift Card",
        "Launchpad",
        "Auto-Invest",
        "ETH Staking",
        "NFT",
        "BABT",
        "Research",
        "Charity",
      ],
    },
    {
      title: "Business",
      links: [
        "P2P Merchant Application",
        "P2Pro Merchant Application",
        "Listing Application",
        "Institutional & VIP Services",
        "Labs",
        "Binance Connect",
      ],
    },
    {
      title: "Learn",
      links: [
        "Learn & Earn",
        "Browse Crypto Prices",
        "Bitcoin Price",
        "Ethereum Price",
        "Browse Crypto Price Predictions",
        "Bitcoin Price Prediction",
        "Ethereum Price Prediction",
        "Buy Bitcoin",
        "Buy BNB",
        "Buy XRP",
        "Buy Dogecoin",
        "Buy Ethereum",
        "Buy Tradable Altcoins",
      ],
    },
    {
      title: "Service",
      links: [
        "Affiliate",
        "Referral",
        "BNB",
        "OTC Trading",
        "Historical Market Data",
        "Trading Insight",
        "Proof of Reserves",
      ],
    },
    {
      title: "Support",
      links: [
        "24/7 Chat Support",
        "Support Center",
        "Product Feedback & Suggestions",
        "Fees",
        "APIs",
        "Binance Verify",
        "Trading Rules",
        "Binance Airdrop Portal",
        "Law Enforcement Requests",
      ],
    },
  ]

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
          {footerSections.map((section, index) => (
            <div key={index} className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h3>

              {section.socialIcons ? (
                <div className="grid grid-cols-3 gap-4">
                  {section.socialIcons.map((social, socialIndex) => (
                    <a
                      key={socialIndex}
                      href="#"
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <FiGlobe className="w-4 h-4" />
                <span>English</span>
              </button>

              <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <FiDollarSign className="w-4 h-4" />
                <span>USD - $</span>
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
                <button
                  onClick={toggleTheme}
                  className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex items-center transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transform transition-transform ${isDark ? "translate-x-6" : "translate-x-0"}`}
                  ></div>
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">Binance© 2025 Cookie Preferences</div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
