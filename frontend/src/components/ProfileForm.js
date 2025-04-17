"use client";

import { useState } from "react";
import { accountApi } from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import ConnectedPlatforms from "./ConnectedPlatforms";

export default function ProfileForm() {
  const { user } = useAuth();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Connected accounts state (mock data, would come from API)
  const [connectedAccounts, setConnectedAccounts] = useState({
    twitter: [],
    discord: [],
    telegram: [],
  });

  // Error states
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    setUpdateLoading(true);

    try {
      const response = await accountApi.updateProfile({
        username: profileData.username,
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      setProfileError(
        error.response?.data?.message || "Failed to update profile"
      );
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);

    try {
      await accountApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password changed successfully");
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError(
        error.response?.data?.message || "Failed to change password"
      );
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDisconnectAccount = async (platform, accountId) => {
    try {
      // In a real application, call API to disconnect
      // await socialAccountApi.disconnectAccount(platform);

      // Update state to reflect the change
      setConnectedAccounts((prev) => ({
        ...prev,
        [platform]: [],
      }));

      toast.success(`Disconnected from ${platform}`);
    } catch (error) {
      console.error(`Error disconnecting from ${platform}:`, error);
      toast.error(`Failed to disconnect from ${platform}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left sidebar with account type */}
      <div className="col-span-1">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Account Type</h2>
          <div className="flex items-center mb-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <svg
                className="w-6 h-6 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-md font-medium text-gray-900">
                {user?.accountType === "individual"
                  ? "Individual Account"
                  : user?.accountType === "business"
                  ? "Business Account"
                  : "Sub-Account"}
              </h3>
              <p className="text-sm text-gray-500">
                {user?.accountType === "individual"
                  ? "Full personal access"
                  : user?.accountType === "business"
                  ? "Can create sub-accounts"
                  : "Limited access"}
              </p>
            </div>
          </div>

          {user?.accountType === "subaccount" && user?.parentAccountId && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Parent Account:</p>
              <p className="text-md font-medium text-gray-900">
                {user.parentAccountName || "Business Account"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="col-span-2 space-y-8">
        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Profile Information
            </h2>
          </div>
          <div className="p-6">
            {profileError && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
                role="alert"
              >
                <p>{profileError}</p>
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              <div className="mb-6">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={profileData.username}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  disabled
                  value={profileData.email}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {updateLoading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
          </div>
          <div className="p-6">
            {passwordError && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
                role="alert"
              >
                <p>{passwordError}</p>
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="mb-6">
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Connected Platforms - Only show for individual and business accounts */}
        {user?.accountType !== "subaccount" && (
          <div className="mt-8">
            <ConnectedPlatforms
              accounts={connectedAccounts}
              onDisconnect={handleDisconnectAccount}
            />
          </div>
        )}
      </div>
    </div>
  );
}
