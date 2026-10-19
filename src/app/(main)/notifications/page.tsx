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
      <div className="bg-white dark:bg-[#0E1012] rounded-sm p-10 text-center border border-[#E5E7EB] dark:border-[#1F2429]">
        <Bell className="w-10 h-10 text-[#6B7280] mx-auto mb-3" />
        <h3 className="font-sans text-base font-medium text-[#0E1012] dark:text-white">
          Sign In to View Notifications
        </h3>
        <p className="font-mono text-xs text-[#6B7280] mt-1.5 max-w-sm mx-auto">
          Select a persona in the top navigation to stream real-time social events.
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
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'COMMENT':
        return <MessageCircle className="w-3.5 h-3.5 text-[#2F4CFF] fill-[#2F4CFF]" />;
      case 'FOLLOW':
        return <UserPlus className="w-3.5 h-3.5 text-[#008B6B]" />;
      case 'MENTION':
        return <AtSign className="w-3.5 h-3.5 text-[#2F4CFF]" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#C45A00]" />;
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
      {/* Header - ITSUA Architectural Rule */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E7EB] dark:border-[#1F2429]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#2F4CFF]" />
          <h1 className="font-sans font-medium text-lg text-[#0E1012] dark:text-white tracking-tight">
            Activity &amp; Notifications
          </h1>
        </div>

        <button
          onClick={markAllAsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-[#E5E7EB] dark:border-[#1F2429] font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white hover:bg-slate-50 dark:hover:bg-[#151722] transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5 text-[#008B6B]" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-3 no-scrollbar font-mono text-xs font-semibold">
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
            className={`px-3 py-1.5 rounded-none uppercase tracking-wider transition-colors shrink-0 ${
              filter === tab.id
                ? 'bg-[#0E1012] dark:bg-white text-white dark:text-[#0E1012]'
                : 'bg-white dark:bg-[#0E1012] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#0E1012] dark:hover:text-white border border-[#E5E7EB] dark:border-[#1F2429]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Stream */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#6B7280]">
          <Loader2 className="w-6 h-6 animate-spin text-[#2F4CFF]" />
          <p className="font-mono text-xs uppercase tracking-wider">Syncing notification stream...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white dark:bg-[#0E1012] rounded-sm p-10 text-center border border-[#E5E7EB] dark:border-[#1F2429]">
          <Bell className="w-10 h-10 text-[#6B7280] mx-auto mb-3" />
          <h3 className="font-sans text-base font-medium text-[#0E1012] dark:text-white">
            No notifications in this category
          </h3>
          <p className="font-mono text-xs text-[#6B7280] mt-1.5">
            When other creators interact with your content, records will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
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
                className={`bg-white dark:bg-[#0E1012] rounded-sm p-3.5 flex items-center justify-between gap-3 transition-all hover:border-[#2F4CFF] border ${
                  isUnread
                    ? 'border-[#2F4CFF] bg-[#2F4CFF]/5 dark:bg-[#2F4CFF]/10'
                    : 'border-[#E5E7EB] dark:border-[#1F2429]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <Avatar
                      src={notification.actor.avatarUrl}
                      alt={notification.actor.name}
                      size="md"
                    />
                    <div className="absolute -bottom-1 -right-1 p-0.5 rounded-none bg-white dark:bg-[#0E1012] border border-[#E5E7EB] dark:border-[#1F2429]">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  <div className="truncate">
                    <p className="font-sans text-xs text-[#0E1012] dark:text-slate-200 leading-snug">
                      <span className="font-medium text-[#0E1012] dark:text-white mr-1">
                        {notification.actor.name}
                      </span>
                      {getNotificationText(notification)}
                    </p>
                    <span className="font-mono text-[10px] text-[#6B7280] mt-0.5 block">
                      {formatRelativeTime(notification.createdAt)}
                    </span>
                  </div>
                </div>

                {isUnread && (
                  <span className="w-2 h-2 rounded-full bg-[#2F4CFF] shrink-0" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
