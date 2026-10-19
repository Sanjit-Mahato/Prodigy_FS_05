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
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white dark:bg-[#07080A] transition-colors relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
          <div className="w-9 h-9 rounded-none bg-[#0E1012] dark:bg-white flex items-center justify-center text-white dark:text-[#0E1012] font-mono font-bold text-sm tracking-wider">
            K
          </div>
          <span className="font-sans font-bold text-xl tracking-tight text-[#0E1012] dark:text-white uppercase">
            Kinetic
          </span>
        </Link>
        <h2 className="text-2xl font-sans font-medium text-[#0E1012] dark:text-white tracking-tight">
          Welcome back
        </h2>
        <p className="font-mono text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1.5 uppercase tracking-wider">
          Sign in or select a 1-click verified creator account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-[#0E1012] py-8 px-6 sm:px-8 rounded-sm border border-[#E5E7EB] dark:border-[#1F2429]">
          {error && (
            <div className="mb-4 p-3 rounded-none bg-orange-50 dark:bg-orange-950/20 border border-[#C45A00]/40 font-mono text-xs font-semibold text-[#C45A00]">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. alex_r or alex@example.com"
                  required
                  className="w-full bg-white dark:bg-[#07080A] border border-[#E5E7EB] dark:border-[#1F2429] rounded-none pl-10 pr-4 py-2.5 font-sans text-xs text-[#0E1012] dark:text-white placeholder-[#6B7280] focus:outline-none focus:border-[#2F4CFF]"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-white dark:bg-[#07080A] border border-[#E5E7EB] dark:border-[#1F2429] rounded-none pl-10 pr-4 py-2.5 font-sans text-xs text-[#0E1012] dark:text-white placeholder-[#6B7280] focus:outline-none focus:border-[#2F4CFF]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-none bg-[#0E1012] hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#0E1012] font-mono text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>Sign In</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB] dark:border-[#1F2429]" />
            </div>
            <div className="relative flex justify-center font-mono text-[10px] uppercase">
              <span className="bg-white dark:bg-[#0E1012] px-3 text-[#6B7280] font-semibold tracking-wider">
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
                className="flex items-center gap-2 p-2 rounded-none bg-slate-50 dark:bg-[#07080A] hover:border-[#2F4CFF] border border-[#E5E7EB] dark:border-[#1F2429] transition-all text-left group"
              >
                <Avatar src={account.avatar} alt={account.name} size="xs" />
                <div className="truncate">
                  <p className="font-sans text-[11px] font-medium text-[#0E1012] dark:text-white truncate group-hover:text-[#2F4CFF]">
                    {account.name.split(' ')[0]}
                  </p>
                  <p className="font-mono text-[9px] text-[#6B7280] truncate">
                    @{account.username}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Link to register */}
          <p className="text-center font-mono text-xs text-[#6B7280] mt-6">
            Don&apos;t have an account yet?{' '}
            <Link
              href="/register"
              className="font-semibold text-[#2F4CFF] hover:underline uppercase tracking-wider ml-1"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
