"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthLayout({ children, requiredAccountType }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(storedUser);

      // Check if user has the required account type
      if (requiredAccountType && userData.accountType !== requiredAccountType) {
        // Redirect to appropriate dashboard based on account type
        if (userData.accountType === "individual") {
          router.push("/dashboard");
        } else if (userData.accountType === "business") {
          router.push("/business-dashboard");
        } else if (userData.accountType === "subaccount") {
          router.push("/subaccount-dashboard");
        } else {
          router.push("/login");
        }
        return;
      }

      setAuthenticated(true);
    } catch (error) {
      console.error("Failed to parse user data:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router, requiredAccountType]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return children;
}
