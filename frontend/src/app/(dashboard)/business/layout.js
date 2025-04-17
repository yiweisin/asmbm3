"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BusinessLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Verify user is logged in and has correct account type
  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (user.accountType !== "business") {
    // Redirect to appropriate dashboard
    if (user.accountType === "individual") {
      router.push("/individual");
    } else if (user.accountType === "subaccount") {
      router.push("/subaccount");
    }
    return null;
  }

  const navLinks = [
    { href: "/business", label: "Dashboard" },
    { href: "/business/subaccounts", label: "Sub-Accounts" },
    { href: "/business/posts", label: "Posts" },
    { href: "/business/analytics", label: "Analytics" },
    { href: "/business/platforms", label: "Platforms" },
    { href: "/business/profile", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-indigo-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/business" className="text-xl font-bold">
                  Social Media Manager
                </Link>
              </div>
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === link.href
                        ? "bg-indigo-700 text-white"
                        : "text-white hover:bg-indigo-500"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
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
        {children}
      </div>
    </div>
  );
}
