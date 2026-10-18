'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import {
  Home,
  Compass,
  Bell,
  User,
  Sparkles,
  PenSquare,
  LogOut,
  Layers,
} from 'lucide-react';

interface SidebarNavProps {
  onOpenCreateModal?: () => void;
}

export function SidebarNav({ onOpenCreateModal }: SidebarNavProps) {
  const pathname = usePathname();
  const { user, unreadCount, logout } = useAuth();

  const navLinks = [
    {
      label: 'Home',
      href: '/feed',
      icon: Home,
      active: pathname === '/feed' || pathname === '/',
    },
    {
      label: 'Explore',
      href: '/explore',
      icon: Compass,
      active: pathname.startsWith('/explore'),
    },
    {
      label: 'Notifications',
      href: '/notifications',
      icon: Bell,
      active: pathname === '/notifications',
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      label: 'Profile',
      href: user ? `/${user.username}` : '/login',
      icon: User,
      active: user ? pathname === `/${user.username}` : false,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 px-4 py-6 border-r border-slate-200/80 dark:border-zinc-800/80 select-none z-30">
      <div>
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 px-3 mb-8 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Prodigy
            </span>
            <span className="text-[10px] block font-semibold text-slate-400 dark:text-zinc-500 tracking-wider uppercase -mt-1">
              Social Platform
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                  link.active
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 ${link.active ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span>{link.label}</span>
                </div>

                {link.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white animate-pulse">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Post Button */}
        {user && onOpenCreateModal && (
          <div className="mt-6 px-1">
            <button
              onClick={onOpenCreateModal}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all transform active:scale-98"
            >
              <PenSquare className="w-4 h-4" />
              <span>Create Post</span>
            </button>
          </div>
        )}
      </div>

      {/* User Profile Mini Card */}
      {user ? (
        <div className="pt-4 border-t border-slate-200/80 dark:border-zinc-800/80">
          <div className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-colors group">
            <Link href={`/${user.username}`} className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar src={user.avatarUrl} alt={user.name} size="sm" showOnline />
              <div className="truncate">
                <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                  @{user.username}
                </p>
              </div>
            </Link>

            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-4 border-t border-slate-200 dark:border-zinc-800">
          <Link
            href="/login"
            className="w-full block text-center py-2.5 rounded-xl border border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold text-xs hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
          >
            Sign In / Register
          </Link>
        </div>
      )}
    </aside>
  );
}
