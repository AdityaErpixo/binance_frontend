import React, { useState } from "react";
import {
  FiHome,
  FiPieChart,
  FiShoppingCart,
  FiGift,
  FiUsers,
  FiUser,
  FiCopy,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  subItems?: { label: string; path: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    Assets: true,
    Orders: true,
    Account: true,
  });

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isAssetsActive = () => {
    return (
      location.pathname === "/assets" ||
      location.pathname.startsWith("/assets/")
    );
  };

  const isOrdersActive = () => {
    return (
      location.pathname === "/orders" ||
      location.pathname.startsWith("/orders/")
    );
  };

  const menuItems: MenuItem[] = [
    {
      icon: FiHome,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: FiPieChart,
      label: "Assets",
      path: "/assets",
      subItems: [
        { label: "Overview", path: "/assets/overview" },
        { label: "Spot", path: "/assets/spot" },
        { label: "Margin", path: "/assets/margin" },
        { label: "Futures", path: "/assets/futures" },
        { label: "Funding", path: "/assets/funding" },
        { label: "Third-Party Wallet", path: "/assets/third-party-wallet" },
      ],
    },
    {
      icon: FiShoppingCart,
      label: "Orders",
      path: "/orders",
      subItems: [
        { label: "Spot Order", path: "/orders/spot" },
        { label: "P2P Order", path: "/orders/p2p" },
        { label: "Transaction History", path: "/orders/transactionhistory" },
        { label: "Payment History", path: "/orders/paymenthistory" },
      ],
    },
    {
      icon: FiGift,
      label: "Rewards Hub",
      path: "/rewards",
    },
    {
      icon: FiUsers,
      label: "Referral",
      path: "/referral",
    },
    {
      icon: FiUser,
      label: "Account",
      path: "/account",
      subItems: [
        { label: "Identification", path: "/account/identification" },
        { label: "Security", path: "/account/security" },
        { label: "Payment", path: "/account/payment" },
        { label: "API Management", path: "/account/api" },
        { label: "Account Statement", path: "/account/statement" },
        { label: "Financial Reports", path: "/account/reports" },
      ],
    },
    {
      icon: FiCopy,
      label: "Sub Accounts",
      path: "/sub-accounts",
    },
    {
      icon: FiSettings,
      label: "Settings",
      path: "/settings",
    },
  ];

  const isItemActive = (item: MenuItem) => {
    if (item.path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/";
    }
    return (
      location.pathname === item.path ||
      (item.label === "Assets" && isAssetsActive()) ||
      (item.label === "Orders" && isOrdersActive()) ||
      (item.subItems?.some(subItem => location.pathname === subItem.path) ?? false)
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div style={{position:"fixed"}}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=48&width=48"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  User-24067
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  VIP Level
                </div>
                <div className="text-xs text-yellow-500 font-medium">
                  Regular User
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Email: 6164a7f10@.g
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Referrals: 0</span>
                <span>Rewards: 0</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-2">
            {menuItems.map((item) => {
              const isActive = isItemActive(item);
              const hasSubItems = !!item.subItems;

              return (
                <div key={item.label} className="mb-1">
                  <div className="flex items-center">
                    <Link
                      to={item.path}
                      className={`flex-1 flex items-center justify-between px-4 py-2 text-sm ${
                        isActive && !hasSubItems
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                      onClick={(e) => {
                        if (hasSubItems) {
                          e.preventDefault();
                          toggleMenu(item.label);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon
                          className={`w-5 h-5 ${
                            isActive
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        />
                        <span
                          className={
                            isActive
                              ? "text-gray-900 dark:text-white font-medium"
                              : ""
                          }
                        >
                          {item.label}
                        </span>
                      </div>
                      {hasSubItems &&
                        (expandedMenus[item.label] ? (
                          <FiChevronDown
                            className={`w-4 h-4 ${
                              isActive
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          />
                        ) : (
                          <FiChevronRight
                            className={`w-4 h-4 ${
                              isActive
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          />
                        ))}
                    </Link>
                  </div>

                  {hasSubItems && expandedMenus[item.label] && (
                    <div className="pl-12 py-1">
                      {item.subItems.map((subItem) => {
                        const isSubItemActive = location.pathname === subItem.path;

                        return (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`block px-2 py-2 text-sm rounded ${
                              isSubItemActive
                                ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 font-medium"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;