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
    <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 px-4 py-6 border-r border-[#E5E7EB] dark:border-[#1F2429] bg-white dark:bg-[#07080A] select-none z-30 transition-colors">
      <div>
        {/* Brand Logo - ITSUA Sharp Architectural Block */}
        <Link href="/" className="flex items-center gap-3 px-2 mb-8 group">
          <div className="w-8 h-8 rounded-none bg-[#0E1012] dark:bg-white flex items-center justify-center text-white dark:text-[#0E1012] font-mono font-bold text-sm tracking-wider">
            K
          </div>
          <div>
            <span className="font-sans font-bold text-base tracking-tight text-[#0E1012] dark:text-white uppercase block leading-tight">
              Kinetic
            </span>
            <span className="font-mono text-[10px] font-semibold text-[#2F4CFF] tracking-wider uppercase">
              Creative Network
            </span>
          </div>
        </Link>

        {/* Navigation Items - ITSUA Mono Utility Navigation */}
        <nav className="space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-none font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                  link.active
                    ? 'bg-[#2F4CFF]/10 text-[#2F4CFF] border-l-2 border-[#2F4CFF]'
                    : 'text-[#6B7280] dark:text-[#9CA3AF] hover:bg-slate-50 dark:hover:bg-[#0E1012] hover:text-[#0E1012] dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${link.active ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span>{link.label}</span>
                </div>

                {link.badge !== undefined && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded-none bg-[#C45A00] text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Post Button - ITSUA Button Primary */}
        {user && onOpenCreateModal && (
          <div className="mt-6 px-1">
            <button
              onClick={onOpenCreateModal}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-none bg-[#0E1012] hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#0E1012] font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <PenSquare className="w-4 h-4" />
              <span>Create Post</span>
            </button>
          </div>
        )}
      </div>

      {/* User Profile Mini Card */}
      {user ? (
        <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#1F2429]">
          <div className="flex items-center justify-between p-2.5 rounded-sm border border-[#E5E7EB] dark:border-[#1F2429] bg-white dark:bg-[#0E1012] transition-colors group">
            <Link href={`/${user.username}`} className="flex items-center gap-2.5 flex-1 min-w-0">
              <Avatar src={user.avatarUrl} alt={user.name} size="sm" showOnline />
              <div className="truncate">
                <p className="font-sans font-medium text-xs text-[#0E1012] dark:text-white truncate">
                  {user.name}
                </p>
                <p className="font-mono text-[11px] text-[#6B7280] dark:text-[#9CA3AF] truncate">
                  @{user.username}
                </p>
              </div>
            </Link>

            <button
              onClick={logout}
              className="p-1.5 text-[#6B7280] hover:text-[#C45A00] rounded-none hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#1F2429]">
          <Link
            href="/login"
            className="w-full block text-center py-2.5 rounded-none border border-[#0E1012] dark:border-[#E5E7EB] text-[#0E1012] dark:text-white font-mono text-xs font-semibold uppercase tracking-wider hover:bg-[#0E1012]/5 dark:hover:bg-white/5 transition-colors"
          >
            Sign In / Register
          </Link>
        </div>
      )}
    </aside>
  );
}
