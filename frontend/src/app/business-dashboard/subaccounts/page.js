"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { toast } from "react-toastify";
import { accountApi, authApi } from "@/api/api";

export default function SubAccountsManagement() {
  const { user } = useAuth();
  const [subAccounts, setSubAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // For creating new subaccount
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchSubAccounts();
  }, []);

  const fetchSubAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountApi.getSubAccounts();
      setSubAccounts(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch sub-accounts. Please try again.");
      toast.error("Failed to fetch sub-accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await authApi.createSubAccount({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Add new subaccount to list
      setSubAccounts((prev) => [...prev, response.data]);

      // Reset form and close creation form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setIsCreating(false);

      toast.success("Sub-account created successfully!");
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Failed to create sub-account"
      );
      toast.error(
        err.response?.data?.message || "Failed to create sub-account"
      );
    }
  };

  const handleDelete = async (id, username) => {
    if (
      window.confirm(
        `Are you sure you want to delete the sub-account "${username}"?`
      )
    ) {
      try {
        await accountApi.deleteSubAccount(id);
        setSubAccounts((prev) => prev.filter((account) => account.id !== id));
        toast.success(`Sub-account "${username}" deleted successfully`);
      } catch (err) {
        toast.error("Failed to delete sub-account. Please try again.");
        console.error(err);
      }
    }
  };

  return (
    <ProtectedRoute requiredAccountType="business">
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
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <Link
                      href="/business-dashboard"
                      className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-500"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/business-dashboard/subaccounts"
                      className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-700 text-white"
                    >
                      Sub-Accounts
                    </Link>
                    <Link
                      href="/business-dashboard/analytics"
                      className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-500"
                    >
                      Analytics
                    </Link>
                    <Link
                      href="/business-dashboard/settings"
                      className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-500"
                    >
                      Settings
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-4">Welcome, {user?.username}</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Sub-Accounts Management</h1>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Create Sub-Account
            </button>
          </div>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isCreating && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Create New Sub-Account</h2>

              {formError && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
                  role="alert"
                >
                  <span className="block sm:inline">{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Username
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subAccounts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No sub-accounts found. Create one to get started.
                      </td>
                    </tr>
                  ) : (
                    subAccounts.map((account) => (
                      <tr key={account.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {account.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {account.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(account.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() =>
                              toast.info(
                                `Reset password for ${account.username} feature coming soon!`
                              )
                            }
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Reset Password
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(account.id, account.username)
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
