import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL_REGISTER = "http://82.29.164.219/api/users/"; 
const API_URL_TOKEN = "http://82.29.164.219/api/token/";
const HERO_IMAGE_URL = "https://placehold.co/100x100/1e293b/a78bfa?text=%E2%9C%A6";

const RegisterForm = () => {
  const nav = useNavigate();

  // form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // errors & status
  const [generalError, setGeneralError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const setBackendFieldErrors = (data) => {
    // DRF returns { field: ["msg", ...], ... }
    setFieldErrors(typeof data === "object" && data !== null ? data : {});
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({});
    if (password !== confirmPassword) {
      setGeneralError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // 1) create user
      await axios.post(API_URL_REGISTER, { username, email, password });

      // 2) auto-login: obtain tokens
      const tokenResp = await axios.post(API_URL_TOKEN, { username, password });
      if (tokenResp?.data?.access) {
        localStorage.setItem("accessToken", tokenResp.data.access);
        if (tokenResp.data.refresh) {
          localStorage.setItem("refresh_token", tokenResp.data.refresh);
        }
      }

      // redirect to home
      nav("/home/");
    } catch (err) {
      
      // handle validation errors (400 object)
      if (err.response && err.response.status === 400 && typeof err.response.data === "object") {
        setBackendFieldErrors(err.response.data);
        setGeneralError("Please fix the errors below.");
      } else {
        const msg = err.response?.data?.detail || "An unexpected error occurred. Please try again.";
        setGeneralError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName) =>
    `block w-full px-4 py-3 border ${
      fieldErrors[fieldName] ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-violet-500"
    } bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none sm:text-sm`;

  const getErrorText = (fieldName) =>
    fieldErrors[fieldName] ? (
      <p className="mt-1 text-xs text-red-400">{String(fieldErrors[fieldName][0])}</p>
    ) : null;

  const onSwitchToLogin = () => {
    nav("/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gray-900"
      style={{ background: "radial-gradient(circle at center, #1f2937 0%, #000000 100%)" }}
    >
      <div className="w-full max-w-md p-8 sm:p-10 bg-gray-800/90 rounded-xl shadow-2xl backdrop-blur-sm transition-all duration-300">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 mb-4 rounded-full border-4 border-violet-500 overflow-hidden shadow-lg">
            <img
              src={HERO_IMAGE_URL}
              alt="Icon"
              className="w-full h-full object-cover p-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/100x100/1e293b/a78bfa?text=🎬";
              }}
            />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create your account</h2>
          <p className="text-sm text-gray-400 mt-1">Join Cine-Vault and start adding your favorites.</p>
        </div>

        <form className="space-y-5" onSubmit={handleRegister}>
          {generalError && <div className="text-center text-red-400 text-sm font-medium">{generalError}</div>}

          <div>
            <label htmlFor="reg-username" className="sr-only">Username</label>
            <input
              id="reg-username"
              name="username"
              type="text"
              required
              className={getInputClass("username")}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {getErrorText("username")}
          </div>

          <div>
            <label htmlFor="reg-email" className="sr-only">Email</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              required
              className={getInputClass("email")}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {getErrorText("email")}
          </div>

          <div>
            <label htmlFor="reg-password" className="sr-only">Password</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              required
              className={getInputClass("password")}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {getErrorText("password")}
          </div>

          <div>
            <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              required
              className="block w-full px-4 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-violet-500 sm:text-sm"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-violet-600 hover:bg-violet-700 transition duration-200 shadow-lg shadow-violet-500/40"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>

          <div className="flex items-center justify-center pt-2">
            <p className="text-sm text-gray-400">
              Already registered?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-medium text-violet-400 hover:text-violet-300"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>

      {/* Small animation style (matches login) */}
      <style>{`
        @keyframes pulse-slow {
          0%,100% { box-shadow: 0 0 10px rgba(167,139,250,0.5), 0 0 20px rgba(167,139,250,0.2); }
          50% { box-shadow: 0 0 20px rgba(167,139,250,0.8), 0 0 30px rgba(167,139,250,0.4); }
        }
      `}</style>
    </div>
  );
};

export default RegisterForm;
