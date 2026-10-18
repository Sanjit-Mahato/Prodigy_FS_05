'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { NotificationWithActor } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { formatRelativeTime } from '@/lib/utils';
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  CheckCheck,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function NotificationsPage() {
  const { user, setUnreadCount } = useAuth();
  const [notifications, setNotifications] = useState<NotificationWithActor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION'>('ALL');

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data.notifications);
        setUnreadCount(data.data.unreadCount);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [setUnreadCount]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, [user, fetchNotifications]);

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const markSingleAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="glass-panel rounded-3xl p-10 text-center border border-slate-200/80 dark:border-zinc-800/80">
        <Bell className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800 dark:text-white">
          Sign In to View Notifications
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto mb-4">
          Select one of our demo personas from the switcher above to see their real-time notification stream.
        </p>
      </div>
    );
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'ALL') return true;
    return n.type === filter;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'LIKE':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'COMMENT':
        return <MessageCircle className="w-4 h-4 text-indigo-500 fill-indigo-500" />;
      case 'FOLLOW':
        return <UserPlus className="w-4 h-4 text-emerald-500" />;
      case 'MENTION':
        return <AtSign className="w-4 h-4 text-purple-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  const getNotificationText = (n: NotificationWithActor) => {
    switch (n.type) {
      case 'LIKE':
        return 'liked your post.';
      case 'COMMENT':
        return 'commented on your post.';
      case 'FOLLOW':
        return 'started following you.';
      case 'MENTION':
        return 'mentioned you in a caption.';
      default:
        return 'interacted with your profile.';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            Activity &amp; Notifications
          </h1>
        </div>

        <button
          onClick={markAllAsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-200/70 dark:hover:bg-zinc-800 transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5 text-indigo-500" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-3 no-scrollbar text-xs font-semibold">
        {[
          { id: 'ALL', label: 'All' },
          { id: 'LIKE', label: 'Likes' },
          { id: 'COMMENT', label: 'Comments' },
          { id: 'FOLLOW', label: 'Follows' },
          { id: 'MENTION', label: 'Mentions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-full transition-colors shrink-0 ${
              filter === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-700/80 border border-slate-200 dark:border-zinc-700/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Stream */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs font-medium">Loading notifications...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="glass-panel rounded-3xl p-10 text-center border border-slate-200/80 dark:border-zinc-800/80">
          <Bell className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            No notifications in this category
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            When other creators interact with your content, you&apos;ll see updates here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredNotifications.map((notification) => {
            const isUnread = !notification.read;
            const targetHref = notification.postId
              ? `/posts/${notification.postId}`
              : `/${notification.actor.username}`;

            return (
              <Link
                key={notification.id}
                href={targetHref}
                onClick={() => markSingleAsRead(notification.id)}
                className={`glass-panel rounded-2xl p-4 flex items-center justify-between gap-3 transition-all hover:border-indigo-400 ${
                  isUnread
                    ? 'border-indigo-300 dark:border-indigo-800/80 bg-indigo-50/30 dark:bg-indigo-950/20'
                    : 'border-slate-200/80 dark:border-zinc-800/80'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <Avatar
                      src={notification.actor.avatarUrl}
                      alt={notification.actor.name}
                      size="md"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white dark:bg-zinc-900 shadow-sm">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  <div className="truncate">
                    <p className="text-xs text-slate-800 dark:text-zinc-200 leading-snug">
                      <span className="font-bold text-slate-900 dark:text-white mr-1">
                        {notification.actor.name}
                      </span>
                      {getNotificationText(notification)}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {formatRelativeTime(notification.createdAt)}
                    </span>
                  </div>
                </div>

                {isUnread && (
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
