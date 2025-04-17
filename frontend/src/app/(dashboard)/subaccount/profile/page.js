"use client";

import ProfileForm from "@/components/ProfileForm";

export default function SubaccountProfilePage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <p className="mt-2 text-gray-600">Manage your account settings</p>
      </div>

      <ProfileForm />
    </>
  );
}
