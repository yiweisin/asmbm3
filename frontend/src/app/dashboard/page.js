"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { toast } from "react-toastify";
// SVG Icons
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

export default function IndividualDashboard() {
  const { user, logout } = useAuth();
  const [socialAccounts, setSocialAccounts] = useState([
    {
      id: 1,
      name: "Twitter",
      connected: true,
      icon: FaTwitter,
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "Instagram",
      connected: true,
      icon: FaInstagram,
      color: "bg-pink-500",
    },
    {
      id: 3,
      name: "Facebook",
      connected: false,
      icon: FaFacebook,
      color: "bg-blue-700",
    },
    {
      id: 4,
      name: "LinkedIn",
      connected: false,
      icon: FaLinkedin,
      color: "bg-blue-500",
    },
  ]);
  const [upcomingPosts, setUpcomingPosts] = useState([
    {
      id: 1,
      time: "Today at 2:30 PM",
      content: "Product launch announcement for Q2 2025...",
      platforms: ["Twitter", "Instagram"],
    },
    {
      id: 2,
      time: "Tomorrow at 10:00 AM",
      content: "Weekly customer spotlight featuring...",
      platforms: ["Twitter", "Facebook"],
    },
    {
      id: 3,
      time: "Friday at 4:15 PM",
      content: "Weekend tips and tricks for using our app...",
      platforms: ["Instagram"],
    },
  ]);
  const [analytics, setAnalytics] = useState({
    engagementRate: { value: 70, change: 12.5 },
    followerGrowth: { value: 45, change: 5.2 },
    clickThroughRate: { value: 35, change: -3.1 },
  });

  const handleConnect = (id) => {
    // Placeholder for social media connection
    toast.info(`Connecting to platform...`);
    setSocialAccounts((prev) =>
      prev.map((account) =>
        account.id === id ? { ...account, connected: true } : account
      )
    );
  };

  return (
    <ProtectedRoute requiredAccountType="individual">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <nav className="bg-indigo-600 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-xl font-bold">
                    Social Media Manager
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-4">Welcome, {user?.username}</span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Individual Account Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your social media accounts and posts
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Social Accounts Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Connected Accounts
                </h3>
                <div className="mt-4 space-y-4">
                  {socialAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className={`${account.color} rounded-full p-2`}>
                          <account.icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="ml-3 text-gray-700">
                          {account.name}
                        </span>
                      </div>
                      {account.connected ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Connected
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConnect(account.id)}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Post Schedule Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Upcoming Posts
                </h3>
                <div className="mt-4 space-y-4">
                  {upcomingPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border-l-4 border-blue-500 pl-4 py-2"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {post.time}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {post.content}
                      </p>
                      <div className="flex space-x-2 mt-1">
                        {post.platforms.map((platform) => {
                          let bgColor = "bg-blue-100 text-blue-800";
                          if (platform === "Instagram")
                            bgColor = "bg-pink-100 text-pink-800";
                          if (platform === "Facebook")
                            bgColor = "bg-blue-100 text-blue-700";
                          return (
                            <span
                              key={platform}
                              className={`px-2 py-1 text-xs rounded-full ${bgColor}`}
                            >
                              {platform}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="text-center">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      View All Scheduled Posts
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Performance
                </h3>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      Engagement Rate
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        analytics.engagementRate.change >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {analytics.engagementRate.change >= 0 ? "↑" : "↓"}{" "}
                      {Math.abs(analytics.engagementRate.change)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${analytics.engagementRate.value}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between mb-4 mt-6">
                    <span className="text-sm text-gray-500">
                      Follower Growth
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        analytics.followerGrowth.change >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {analytics.followerGrowth.change >= 0 ? "↑" : "↓"}{" "}
                      {Math.abs(analytics.followerGrowth.change)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${analytics.followerGrowth.value}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between mb-4 mt-6">
                    <span className="text-sm text-gray-500">
                      Click-through Rate
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        analytics.clickThroughRate.change >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {analytics.clickThroughRate.change >= 0 ? "↑" : "↓"}{" "}
                      {Math.abs(analytics.clickThroughRate.change)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${
                        analytics.clickThroughRate.change >= 0
                          ? "bg-green-500"
                          : "bg-red-500"
                      } h-2 rounded-full`}
                      style={{ width: `${analytics.clickThroughRate.value}%` }}
                    ></div>
                  </div>

                  <div className="text-center mt-6">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      View Full Analytics
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Quick Actions
            </h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={() => toast.info("Create post feature coming soon!")}
                className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center shadow-sm"
              >
                <svg
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                <span className="mt-2 text-sm font-medium">Create Post</span>
              </button>

              <button
                onClick={() => toast.info("Schedule post feature coming soon!")}
                className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center shadow-sm"
              >
                <svg
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <span className="mt-2 text-sm font-medium">Schedule Post</span>
              </button>

              <button
                onClick={() => toast.info("Analytics feature coming soon!")}
                className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center shadow-sm"
              >
                <svg
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
                <span className="mt-2 text-sm font-medium">View Analytics</span>
              </button>

              <button
                onClick={() => toast.info("Settings feature coming soon!")}
                className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center shadow-sm"
              >
                <svg
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span className="mt-2 text-sm font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
