"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        logout();
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError("");
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      // Redirect based on account type
      if (data.accountType === "individual") {
        router.push("/dashboard");
      } else if (data.accountType === "business") {
        router.push("/business-dashboard");
      } else if (data.accountType === "subaccount") {
        router.push("/subaccount-dashboard");
      }

      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setError("");
    setLoading(true);

    try {
      const response = await authApi.register(userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createSubAccount = async (subAccountData) => {
    setError("");
    setLoading(true);

    try {
      const response = await authApi.createSubAccount(subAccountData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create sub-account");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        createSubAccount,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
