"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { accountApi } from "@/api/api";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";

export default function SubaccountDashboard() {
  const { user } = useAuth();
  const [parentAccount, setParentAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "success",
      title: "Post published successfully",
      time: "30 minutes ago",
    },
    {
      id: 2,
      type: "notification",
      title: "New comment on your post",
      time: "2 hours ago",
    },
    {
      id: 3,
      type: "schedule",
      title: "Post scheduled for tomorrow",
      time: "5 hours ago",
    },
  ]);

  useEffect(() => {
    const fetchParentAccount = async () => {
      if (user?.parentAccountId) {
        try {
          const response = await accountApi.getAccountById(
            user.parentAccountId
          );
          setParentAccount(response.data);
        } catch (err) {
          console.error("Failed to fetch parent account:", err);
          setError("Failed to fetch parent account details");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (user) {
      fetchParentAccount();
    }
  }, [user]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Sub-Account Dashboard
        </h1>
        {parentAccount && (
          <p className="mt-2 text-gray-600">
            Managed by {parentAccount.username}
          </p>
        )}
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <button
                  onClick={() =>
                    toast.info("View all posts feature coming soon!")
                  }
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                  View All Scheduled Posts
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Accounts Card - Note this is just informative, subaccounts can't connect */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Social Account Access
            </h3>
            <div className="mt-4">
              <p className="text-gray-600 mb-4">
                As a sub-account, you have access to post on the main account's
                connected platforms:
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-blue-500 rounded-full p-2">
                    <FaTwitter className="h-6 w-6 text-white" />
                  </div>
                  <span className="ml-3 text-gray-700">Twitter</span>
                </div>

                <div className="flex items-center">
                  <div className="bg-pink-500 rounded-full p-2">
                    <FaInstagram className="h-6 w-6 text-white" />
                  </div>
                  <span className="ml-3 text-gray-700">Instagram</span>
                </div>

                <div className="flex items-center">
                  <div className="bg-blue-700 rounded-full p-2">
                    <FaFacebook className="h-6 w-6 text-white" />
                  </div>
                  <span className="ml-3 text-gray-700">Facebook</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Platform connections are managed by the business account
                  admin.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h3>
            <div className="mt-4 space-y-4">
              {recentActivities.map((activity) => {
                let iconBgColor = "bg-green-100";
                let iconColor = "text-green-600";
                let icon = (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                );

                if (activity.type === "notification") {
                  iconBgColor = "bg-blue-100";
                  iconColor = "text-blue-600";
                  icon = (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      ></path>
                    </svg>
                  );
                } else if (activity.type === "schedule") {
                  iconBgColor = "bg-yellow-100";
                  iconColor = "text-yellow-600";
                  icon = (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  );
                }

                return (
                  <div key={activity.id} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div
                        className={`h-8 w-8 rounded-full ${iconBgColor} flex items-center justify-center`}
                      >
                        <span className={iconColor}>{icon}</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}

              <div className="text-center">
                <button
                  onClick={() =>
                    toast.info("View all activity feature coming soon!")
                  }
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                  View All Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
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

          <Link
            href="/subaccount/profile"
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            <span className="mt-2 text-sm font-medium">Profile</span>
          </Link>
        </div>
      </div>
    </>
  );
}
