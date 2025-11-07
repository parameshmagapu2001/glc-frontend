"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Hardcoded user credentials and role-based redirect paths
const users = [
  { email: "sd@glc.com", password: "admin1234", path: "/admin/super-admin/dashboard" },
  { email: "rm@glc.com", password: "admin1234", path: "/admin/role-manager/dashboard" },
  { email: "fo@glc.com", password: "admin1234", path: "/admin/field-officer/dashboard" },
  { email: "ccs@glc.com", password: "admin1234", path: "/admin/ccs/dashboard" },
  { email: "ro@glc.com", password: "admin1234", path: "/admin/region-officer/dashboard" },
  { email: "io@glc.com", password: "admin1234", path: "/admin/intelligence-officer/dashboard" },
  { email: "officer1@glc.com", password: "admin1234", path: "/admin/document-valuation-officer/dashboard" },
  { email: "officer2@glc.com", password: "admin1234", path: "/admin/document-valuation-officer/dashboard" },
  { email: "officer3@glc.com", password: "admin1234", path: "/admin/intelligence-officer/dashboard" },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = users.find(
      (u) => u.email === email.trim() && u.password === password.trim()
    );

    if (user) {
      router.push(user.path);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-[#F9FAFB]">
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-10 md:px-20 bg-gradient-to-br from-[#f3f5f7] to-[#ffffff]">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.png"
            alt="Green Land Capital"
            width={100}
            height={100}
            className="mb-4"
          />
          <h1 className="text-3xl font-semibold text-gray-800 text-center">
            Welcome To <br />
            <span className="text-[#0f5132]">Green Land Capital</span>
          </h1>
        </div>

        <Image
          src="/admin/images/farmLandForm.png"
          alt="Illustration"
          width={400}
          height={400}
          className="max-w-full"
        />

        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="mb-2">
            <a href="#" className="text-blue-600 hover:underline">
              Terms & conditions
            </a>{" "}
            |{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
          <p>
            © All rights reserved by{" "}
            <a href="#" className="text-[#0f5132] font-semibold">
              Green Land Capital
            </a>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center bg-[#F9FAFB] px-6 md:px-16">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sign in</h2>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              User Name
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
            <span
              className="absolute right-3 top-8 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-4">
            <a
              href="/admin/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#1E293B] text-white py-2 rounded-md hover:bg-[#0f172a] transition"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
