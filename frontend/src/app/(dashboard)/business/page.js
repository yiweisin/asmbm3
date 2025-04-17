"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { accountApi } from "@/api/api";
import Link from "next/link";
import { toast } from "react-toastify";

export default function BusinessDashboard() {
  const { user } = useAuth();
  const [subAccounts, setSubAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubAccounts = async () => {
      try {
        setLoading(true);
        const response = await accountApi.getSubAccounts();
        setSubAccounts(response.data);
      } catch (err) {
        setError("Failed to fetch sub-accounts. Please try again.");
        toast.error("Failed to fetch sub-accounts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubAccounts();
  }, []);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your business accounts and team members
        </p>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Sub-Accounts
              </h2>
              <p className="text-3xl font-bold text-gray-700">
                {subAccounts.length}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/business/subaccounts"
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              Manage Sub-Accounts →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg
                className="h-8 w-8"
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
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Scheduled Posts
              </h2>
              <p className="text-3xl font-bold text-gray-700">24</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/business/posts"
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              View All Posts →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                ></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Total Engagement
              </h2>
              <p className="text-3xl font-bold text-gray-700">15.8K</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/business/analytics"
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              View Analytics →
            </Link>
          </div>
        </div>
      </div>

      {/* Sub-Accounts Overview */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Sub-Accounts</h3>
            <Link
              href="/business/subaccounts"
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="px-6 py-5">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : subAccounts.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-4">No sub-accounts created yet.</p>
              <Link
                href="/business/subaccounts"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create Sub-Account
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {subAccounts.slice(0, 3).map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {account.username}
                    </p>
                    <p className="text-sm text-gray-500">{account.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        toast.info(
                          `Login as ${account.username} feature coming soon!`
                        )
                      }
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Login As
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() =>
                        toast.info(
                          `Edit ${account.username} feature coming soon!`
                        )
                      }
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/business/subaccounts"
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              ></path>
            </svg>
            <span className="mt-2 text-sm font-medium">Create Sub-Account</span>
          </Link>

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
            href="/business/profile"
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
          </Link>
        </div>
      </div>
    </>
  );
}
