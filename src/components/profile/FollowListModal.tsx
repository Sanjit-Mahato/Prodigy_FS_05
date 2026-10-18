'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { SafeUser } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, Check, Loader2 } from 'lucide-react';

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  initialTab?: 'followers' | 'following';
}

export function FollowListModal({
  isOpen,
  onClose,
  username,
  initialTab = 'followers',
}: FollowListModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    fetch(`/api/users/${username}/${activeTab}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.data);
          const map: Record<string, boolean> = {};
          data.data.forEach((u: SafeUser) => {
            map[u.id] = !!u.isFollowing;
          });
          setFollowingMap(map);
        }
      })
      .catch((err) => console.error('Fetch follow list error', err))
      .finally(() => setLoading(false));
  }, [isOpen, username, activeTab]);

  const handleFollowToggle = async (targetUser: SafeUser) => {
    if (!user) {
      alert('Please log in or select a demo persona to follow users!');
      return;
    }

    const currentStatus = !!followingMap[targetUser.id];
    setFollowingMap((prev) => ({ ...prev, [targetUser.id]: !currentStatus }));

    try {
      const res = await fetch(`/api/users/${targetUser.username}/follow`, { method: 'POST' });
      const data = await res.json();
      if (!data.success) {
        setFollowingMap((prev) => ({ ...prev, [targetUser.id]: currentStatus }));
      }
    } catch {
      setFollowingMap((prev) => ({ ...prev, [targetUser.id]: currentStatus }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`@${username}`}
      maxWidth="md"
    >
      <div>
        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-zinc-800 mb-4">
          <button
            onClick={() => setActiveTab('followers')}
            className={`flex-1 pb-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'followers'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Followers
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 pb-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'following'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Following
          </button>
        </div>

        {/* Users list */}
        {loading ? (
          <div className="flex items-center justify-center py-10 text-xs text-slate-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Loading {activeTab}...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No {activeTab} found for this user.
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {users.map((item) => {
              const isFollowed = followingMap[item.id];
              const isSelf = user?.id === item.id;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <Link
                    href={`/${item.username}`}
                    onClick={onClose}
                    className="flex items-center gap-3 min-w-0 flex-1 group"
                  >
                    <Avatar src={item.avatarUrl} alt={item.name} size="md" />
                    <div className="truncate">
                      <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        @{item.username}
                      </p>
                    </div>
                  </Link>

                  {!isSelf && user && (
                    <button
                      onClick={() => handleFollowToggle(item)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        isFollowed
                          ? 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                      }`}
                    >
                      {isFollowed ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3" /> Following
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <UserPlus className="w-3 h-3" /> Follow
                        </span>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
