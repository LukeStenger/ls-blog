import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Auth({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Account created! You can now sign in.');
        setIsSignUp(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onLogin(data.user);
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-50 mb-2">
            {isSignUp ? 'Create Account' : 'Admin Login'}
          </h1>
          <p className="text-zinc-500">Authenticate to manage posts</p>
        </div>

        <form onSubmit={handleAuth} className="bg-zinc-950 border border-red-900/50 p-8 space-y-4">
          <div>
            <label className="block text-red-300 mb-2 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-black border border-zinc-800 text-red-50 focus:outline-none focus:border-red-900"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-red-300 mb-2 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-3 bg-black border border-zinc-800 text-red-50 focus:outline-none focus:border-red-900"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <div className={`p-3 border text-sm ${
              message.includes('created') || message.includes('success')
                ? 'bg-green-950/30 border-green-800 text-green-300'
                : 'bg-red-950/30 border-red-800 text-red-300'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-950 text-red-100 font-semibold hover:bg-red-900 transition-all duration-300 border border-red-800 disabled:opacity-50"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage('');
            }}
            className="w-full text-zinc-500 hover:text-zinc-300 text-sm"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}