"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your login ID.");
      return;
    }
    // Placeholder — integrate actual API call later
    setMessage("Password reset instructions have been sent to your email.");
    setEmail("");
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-[#f9f9ff]">
      {/* Left Illustration Section */}
      <div className="flex-1 flex items-center justify-center bg-[#7c7afc]">
        <div className="p-8">
          <Image
            src="/images/forgot-password.png"
            alt="Forgot Password Illustration"
            width={500}
            height={500}
            className="rounded-xl drop-shadow-lg"
          />
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-10 bg-white">
        <div className="max-w-md w-full">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-[#E0E7FF] p-4 rounded-full">
              <span className="text-3xl">🔒</span>
            </div>
          </div>

          <h2 className="text-3xl font-semibold text-gray-800 mb-2 text-center">
            Forgot your password?
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Please enter the login ID associated with your account
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Login ID <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter Login ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-5 focus:outline-none focus:ring-2 focus:ring-[#7c7afc]"
            />

            <button
              type="submit"
              className="w-full bg-[#7c7afc] hover:bg-[#6b68e4] text-white py-2 rounded-md transition"
            >
              Send Request
            </button>

            {message && (
              <p className="text-sm text-green-600 mt-3 text-center">{message}</p>
            )}
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/admin/login")}
              className="text-sm text-[#7c7afc] hover:underline flex items-center justify-center gap-1"
            >
              <span>←</span> Return to sign in
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
