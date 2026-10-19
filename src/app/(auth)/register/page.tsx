'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Loader2, ArrowRight, Lock, User as UserIcon, Mail } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await register({
      name: name.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password,
    });

    if (res.success) {
      router.push('/feed');
    } else {
      setError(res.error || 'Registration failed');
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
          Create account
        </h2>
        <p className="font-mono text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1.5 uppercase tracking-wider">
          Register for the high-throughput creator platform.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-[#0E1012] py-8 px-6 sm:px-8 rounded-sm border border-[#E5E7EB] dark:border-[#1F2429]">
          {error && (
            <div className="mb-4 p-3 rounded-none bg-orange-50 dark:bg-orange-950/20 border border-[#C45A00]/40 font-mono text-xs font-semibold text-[#C45A00]">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Smith"
                  required
                  className="w-full bg-white dark:bg-[#07080A] border border-[#E5E7EB] dark:border-[#1F2429] rounded-none pl-10 pr-4 py-2.5 font-sans text-xs text-[#0E1012] dark:text-white placeholder-[#6B7280] focus:outline-none focus:border-[#2F4CFF]"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs font-semibold text-[#6B7280]">
                  @
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="jordansmith"
                  required
                  className="w-full bg-white dark:bg-[#07080A] border border-[#E5E7EB] dark:border-[#1F2429] rounded-none pl-9 pr-4 py-2.5 font-sans text-xs text-[#0E1012] dark:text-white placeholder-[#6B7280] focus:outline-none focus:border-[#2F4CFF]"
                />
              </div>
              <p className="font-mono text-[10px] text-[#6B7280] mt-1">Letters, numbers, and underscores only</p>
            </div>

            <div>
              <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@example.com"
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
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
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
              <span>Create Account</span>
            </button>
          </form>

          {/* Link to login */}
          <p className="text-center font-mono text-xs text-[#6B7280] mt-6">
            Already registered?{' '}
            <Link
              href="/login"
              className="font-semibold text-[#2F4CFF] hover:underline uppercase tracking-wider ml-1"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
