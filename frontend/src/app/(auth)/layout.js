"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AuthLayout({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Redirect to the appropriate dashboard based on account type
      if (user.accountType === "individual") {
        router.push("/individual");
      } else if (user.accountType === "business") {
        router.push("/business");
      } else if (user.accountType === "subaccount") {
        router.push("/subaccount");
      }
    }
  }, [isAuthenticated, loading, user, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      {children}
    </div>
  );
}
