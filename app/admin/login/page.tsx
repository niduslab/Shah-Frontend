"use client";

import Image from "next/image";
import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!loading && user && user.user_type === 'admin') {
      router.push('/admin');
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await login(email, password);
      const loggedInUser = response.data.user;
      
      // Check if user is admin
      if (loggedInUser.user_type === 'admin') {
        // Direct navigation to admin dashboard
        window.location.href = '/admin';
      } else {
        setError("Access denied. Admin privileges required.");
        setIsLoading(false);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Login failed. Please check your credentials.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="bg-[#00072D] p-8 text-center">
          <Image
            src="/Shah Sports.png"
            alt="Shah Sports"
            width={180}
            height={50}
            className="mx-auto h-12 w-auto object-contain brightness-0 invert"
          />
          <h2 className="mt-4 text-2xl font-bold text-white">Admin Portal</h2>
          <p className="mt-2 text-sm text-gray-300">Sign in to manage your dashboard</p>
        </div>

        <div className="p-8">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">
                {error}
              </div>
            )}
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shahsports.com"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-[#00072D] focus:ring-[#00072D]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-[#00072D] focus:ring-[#00072D]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-[#00072D] focus:ring-[#00072D]"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-500">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-[#00072D] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#00072D] px-5 py-3 text-center text-sm font-medium text-white hover:bg-[#00072D]/90 focus:outline-none focus:ring-4 focus:ring-[#00072D]/50 disabled:opacity-70"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Shah Sports. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
