import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// API endpoint for JWT token
const API_URL = "http://82.29.164.219/api/token/";

// Optional placeholder cinematic icon
const HERO_IMAGE_URL = "https://placehold.co/100x100/1e293b/a78bfa?text=%E2%9C%A6";

const LoginForm = () => {
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔹 Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(API_URL, { username, password });

      // ✅ Store tokens for authenticated requests
      localStorage.setItem('accessToken', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }

      

      // Redirect to protected home page
      nav('/home/');
    } catch (err) {
      
      if (err.response?.status === 401)
        setError('Invalid username or password.');
      else
        setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Navigate to Register Page
  const onSwitchToRegister = () => {
    nav('/user_registration/');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gray-900"
      style={{
        background: 'radial-gradient(circle at center, #1f2937 0%, #000000 100%)',
      }}
    >
      {/* Login Card */}
      <div className="w-full max-w-md p-8 sm:p-10 bg-gray-800/90 rounded-xl shadow-2xl hover:shadow-violet-900/50 backdrop-blur-sm transition-all duration-300">
        {/* Cinematic Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 mb-4 rounded-full border-4 border-violet-500 overflow-hidden shadow-lg">
            <img
              src={HERO_IMAGE_URL}
              alt="Movie Icon"
              className="w-full h-full object-cover p-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/100x100/1e293b/a78bfa?text=🎬";
              }}
            />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-wider">
            Access Cine-Vault
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Your next favorite show is waiting.
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            {/* Username */}
            <div>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                placeholder="Username"
              />
            </div>

            {/* Password */}
            <div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                placeholder="Password"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-400 text-sm text-center font-medium mt-2">
              {error}
            </p>
          )}

          {/* Login Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-violet-600 hover:bg-violet-700 transition duration-200 shadow-lg shadow-violet-500/50 hover:shadow-violet-400/70 animate-pulse-slow"
              style={{
                '--tw-animate-duration': '3s',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Your Mission'}
            </button>
          </div>

          {/* Register Redirect */}
          <div className="flex items-center justify-center pt-4">
            <p className="text-sm text-gray-400">
              New crew member?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-medium text-violet-400 hover:text-violet-300 transition duration-150"
              >
                Create an account
              </button>
            </p>
          </div>
        </form>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(167, 139, 250, 0.5),
                        0 0 20px rgba(167, 139, 250, 0.2);
          }
          50% {
            box-shadow: 0 0 20px rgba(167, 139, 250, 0.8),
                        0 0 30px rgba(167, 139, 250, 0.4);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow var(--tw-animate-duration, 2s) cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
