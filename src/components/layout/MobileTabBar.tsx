'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Home, Compass, PlusSquare, Bell, User } from 'lucide-react';

interface MobileTabBarProps {
  onOpenCreateModal?: () => void;
}

export function MobileTabBar({ onOpenCreateModal }: MobileTabBarProps) {
  const pathname = usePathname();
  const { user, unreadCount } = useAuth();

  const tabs = [
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
      label: 'Create',
      action: onOpenCreateModal,
      icon: PlusSquare,
      isSpecial: true,
    },
    {
      label: 'Alerts',
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-zinc-800/80 px-3 py-2 flex items-center justify-around shadow-lg">
      {tabs.map((tab, idx) => {
        const Icon = tab.icon;

        if (tab.isSpecial) {
          return (
            <button
              key={idx}
              onClick={tab.action}
              className="p-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 active:scale-95 transition-transform"
              aria-label="Create Post"
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        }

        return (
          <Link
            key={idx}
            href={tab.href!}
            className={`relative p-2 rounded-xl transition-colors flex flex-col items-center ${
              tab.active
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 ${tab.active ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {tab.badge !== undefined && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-950" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
