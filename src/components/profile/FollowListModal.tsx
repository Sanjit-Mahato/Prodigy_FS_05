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
      title={`@${username} Ledger`}
      maxWidth="md"
    >
      <div>
        {/* Tab Switcher */}
        <div className="flex border-b border-[#E5E7EB] dark:border-[#1F2429] mb-4">
          <button
            onClick={() => setActiveTab('followers')}
            className={`flex-1 pb-2.5 font-mono text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'followers'
                ? 'border-[#2F4CFF] text-[#2F4CFF]'
                : 'border-transparent text-[#6B7280] hover:text-[#0E1012] dark:hover:text-white'
            }`}
          >
            Followers
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 pb-2.5 font-mono text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'following'
                ? 'border-[#2F4CFF] text-[#2F4CFF]'
                : 'border-transparent text-[#6B7280] hover:text-[#0E1012] dark:hover:text-white'
            }`}
          >
            Following
          </button>
        </div>

        {/* Users list */}
        {loading ? (
          <div className="flex items-center justify-center py-10 font-mono text-xs text-[#6B7280] gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#2F4CFF]" />
            <span>Loading {activeTab}...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-8 text-center font-mono text-xs text-[#6B7280]">
            No {activeTab} indexed for this account.
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {users.map((item) => {
              const isFollowed = followingMap[item.id];
              const isSelf = user?.id === item.id;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-1.5 rounded-none hover:bg-slate-50 dark:hover:bg-[#151722] transition-colors"
                >
                  <Link
                    href={`/${item.username}`}
                    onClick={onClose}
                    className="flex items-center gap-3 min-w-0 flex-1 group"
                  >
                    <Avatar src={item.avatarUrl} alt={item.name} size="md" />
                    <div className="truncate">
                      <p className="font-sans font-medium text-xs text-[#0E1012] dark:text-white group-hover:text-[#2F4CFF] transition-colors truncate">
                        {item.name}
                      </p>
                      <p className="font-mono text-[11px] text-[#6B7280] truncate">
                        @{item.username}
                      </p>
                    </div>
                  </Link>

                  {!isSelf && user && (
                    <button
                      onClick={() => handleFollowToggle(item)}
                      className={`px-3 py-1.5 rounded-none font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                        isFollowed
                          ? 'bg-slate-100 dark:bg-[#151722] text-[#6B7280] border border-[#E5E7EB] dark:border-[#1F2429]'
                          : 'bg-[#0E1012] hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#0E1012]'
                      }`}
                    >
                      {isFollowed ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-[#008B6B]" /> Following
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
