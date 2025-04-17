"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({
  children,
  requiredAccountType = null,
  redirectTo = "/login",
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Wait for auth state to be determined
    if (!loading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
      } else if (
        requiredAccountType &&
        user.accountType !== requiredAccountType
      ) {
        // Redirect based on account type
        if (user.accountType === "individual") {
          router.push("/dashboard");
        } else if (user.accountType === "business") {
          router.push("/business-dashboard");
        } else if (user.accountType === "subaccount") {
          router.push("/subaccount-dashboard");
        } else {
          router.push(redirectTo);
        }
      } else {
        setIsCheckingAuth(false);
      }
    }
  }, [isAuthenticated, loading, requiredAccountType, redirectTo, router, user]);

  if (loading || isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return children;
}
