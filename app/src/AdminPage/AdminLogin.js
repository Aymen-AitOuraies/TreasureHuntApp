import React, { useState } from "react";
import { Icon } from "@iconify/react";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary via-background to-secondary flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white bg-opacity-80 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
          <div className="flex items-center justify-center mb-4 sm:mb-6 mt-4 sm:mt-8">
            <div className="relative flex items-center">
              <div className="w-8 sm:w-12 md:w-20 h-0.5 bg-black"></div>
              <div className="absolute right-2 sm:right-3 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-black rounded-full"></div>
              <div className="absolute right-0 w-2 sm:w-3 h-2 sm:h-3 bg-black rounded-full"></div>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-cormorant text-black mx-2 sm:mx-3 md:mx-4">
              Admin Login
            </h1>
            <div className="relative flex items-center">
              <div className="w-8 sm:w-12 md:w-20 h-0.5 bg-black"></div>
              <div className="absolute left-2 sm:left-3 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-black rounded-full"></div>
              <div className="absolute left-0 w-2 sm:w-3 h-2 sm:h-3 bg-black rounded-full"></div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            <div>
              <label className="block text-secondary font-cormorant text-lg sm:text-xl font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@treasurehunt.com"
                className="w-full bg-primary bg-opacity-20 border-2 border-secondary outline-none p-2.5 sm:p-3 rounded-lg placeholder:text-gray-500 text-secondary font-cormorant text-base sm:text-lg focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-secondary font-cormorant text-lg sm:text-xl font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-primary bg-opacity-20 border-2 border-secondary outline-none p-2.5 sm:p-3 rounded-lg placeholder:text-gray-500 text-secondary font-cormorant text-base sm:text-lg focus:border-primary transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg shadow-md animate-shake">
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:alert-circle" className="text-xl sm:text-2xl flex-shrink-0" />
                  <p className="font-cormorant text-sm sm:text-base">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-secondary text-background text-lg sm:text-xl md:text-2xl font-cormorant font-bold p-2.5 sm:p-3 rounded-full cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
