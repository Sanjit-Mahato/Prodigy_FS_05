'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Loader2, ArrowRight, Lock, User as UserIcon } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchDemoUser } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    {
      username: 'alex_r',
      name: 'Alex Rivera',
      role: 'UI Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      username: 'sarah_c',
      name: 'Sarah Chen',
      role: 'Photographer',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    },
    {
      username: 'leo_v',
      name: 'Leo Vance',
      role: 'Motion Artist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      username: 'maya_p',
      name: 'Maya Patel',
      role: 'AI Researcher',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(identifier, password);
    if (res.success) {
      router.push('/feed');
    } else {
      setError(res.error || 'Login failed');
      setLoading(false);
    }
  };

  const handleDemoLogin = async (username: string) => {
    setLoading(true);
    setError(null);
    const res = await switchDemoUser(username);
    if (res.success) {
      router.push('/feed');
    } else {
      setError(res.error || 'Failed to switch demo user');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#0c0e14] mesh-gradient">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
            Prodigy
          </span>
        </Link>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Sign in to your account or select a 1-click testing persona below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-zinc-800/80">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. alex_r or alex@example.com"
                  required
                  className="w-full bg-slate-100 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-slate-100 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>Sign In</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-900 px-3 text-slate-400 font-semibold tracking-wider text-[10px]">
                Or 1-Click Demo Login
              </span>
            </div>
          </div>

          {/* Demo personas list */}
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((account) => (
              <button
                key={account.username}
                type="button"
                onClick={() => handleDemoLogin(account.username)}
                disabled={loading}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-100/70 dark:bg-zinc-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/60 dark:border-zinc-700/60 transition-all text-left group"
              >
                <Avatar src={account.avatar} alt={account.name} size="xs" />
                <div className="truncate">
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {account.name.split(' ')[0]}
                  </p>
                  <p className="text-[9px] text-slate-400 truncate">
                    @{account.username}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Link to register */}
          <p className="text-center text-xs text-slate-500 dark:text-zinc-400 mt-6">
            Don&apos;t have an account yet?{' '}
            <Link
              href="/register"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
