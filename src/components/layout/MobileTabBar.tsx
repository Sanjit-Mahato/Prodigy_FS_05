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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#0E1012] border-t border-[#E5E7EB] dark:border-[#1F2429] px-3 py-2 flex items-center justify-around transition-colors">
      {tabs.map((tab, idx) => {
        const Icon = tab.icon;

        if (tab.isSpecial) {
          return (
            <button
              key={idx}
              onClick={tab.action}
              className="p-2.5 rounded-none bg-[#0E1012] dark:bg-white text-white dark:text-[#0E1012] active:scale-95 transition-transform"
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
            className={`relative p-2 rounded-none transition-colors flex flex-col items-center ${
              tab.active
                ? 'text-[#2F4CFF] font-semibold'
                : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#0E1012] dark:hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 ${tab.active ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {tab.badge !== undefined && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C45A00]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
