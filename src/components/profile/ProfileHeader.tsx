'use client';

import React, { useState } from 'react';
import { SafeUser } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { EditProfileModal } from './EditProfileModal';
import { FollowListModal } from './FollowListModal';
import { formatFullDate } from '@/lib/utils';
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  Edit3,
  UserPlus,
  Check,
} from 'lucide-react';

interface ProfileHeaderProps {
  user: SafeUser;
  onUserUpdated: (updatedUser: SafeUser) => void;
}

export function ProfileHeader({ user, onUserUpdated }: ProfileHeaderProps) {
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(user._count?.followers || 0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followModalTab, setFollowModalTab] = useState<'followers' | 'following'>('followers');

  const isSelf = currentUser?.id === user.id;

  const handleFollowToggle = async () => {
    if (!currentUser) {
      alert('Please select or log in to a persona to follow users!');
      return;
    }

    const previousStatus = isFollowing;
    const previousCount = followersCount;

    // Optimistic toggle
    const newStatus = !isFollowing;
    setIsFollowing(newStatus);
    setFollowersCount(newStatus ? followersCount + 1 : Math.max(0, followersCount - 1));

    try {
      const res = await fetch(`/api/users/${user.username}/follow`, { method: 'POST' });
      const data = await res.json();
      if (!data.success) {
        setIsFollowing(previousStatus);
        setFollowersCount(previousCount);
      }
    } catch {
      setIsFollowing(previousStatus);
      setFollowersCount(previousCount);
    }
  };

  const openFollowers = () => {
    setFollowModalTab('followers');
    setShowFollowModal(true);
  };

  const openFollowing = () => {
    setFollowModalTab('following');
    setShowFollowModal(true);
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden mb-6 border border-slate-200/80 dark:border-zinc-800/80 shadow-sm">
      {/* Cover Banner */}
      <div
        className="h-36 sm:h-52 w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-cover bg-center relative"
        style={{
          backgroundImage: user.coverUrl ? `url(${user.coverUrl})` : undefined,
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Main Profile Info */}
      <div className="px-5 sm:px-8 pb-6 pt-3 relative">
        {/* Avatar & Top Action Bar */}
        <div className="flex items-end justify-between -mt-16 sm:-mt-20 mb-4">
          <div className="relative">
            <Avatar
              src={user.avatarUrl}
              alt={user.name}
              size="2xl"
              className="ring-4 ring-white dark:ring-[#0c0e14] shadow-xl"
            />
          </div>

          <div className="flex items-center gap-2">
            {isSelf ? (
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-slate-800 dark:text-zinc-200 transition-colors shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : currentUser ? (
              <button
                onClick={handleFollowToggle}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md ${
                  isFollowing
                    ? 'bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>

        {/* User Names & Bio */}
        <div className="space-y-2 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {user.name}
            </h1>
            <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">
              @{user.username}
            </p>
          </div>

          {user.bio && (
            <p className="text-xs sm:text-sm text-slate-800 dark:text-zinc-300 whitespace-pre-line leading-relaxed max-w-2xl">
              {user.bio}
            </p>
          )}

          {/* Metadata badges: location, website, joined date */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-zinc-400 pt-1">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {user.location}
              </span>
            )}

            {user.website && (
              <a
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            )}

            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Joined {formatFullDate(user.createdAt)}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs">
          <div>
            <span className="font-extrabold text-slate-900 dark:text-white text-sm mr-1">
              {user._count?.posts || 0}
            </span>
            <span className="text-slate-500 dark:text-zinc-400">Posts</span>
          </div>

          <button
            onClick={openFollowers}
            className="hover:underline focus:outline-none"
          >
            <span className="font-extrabold text-slate-900 dark:text-white text-sm mr-1">
              {followersCount}
            </span>
            <span className="text-slate-500 dark:text-zinc-400">Followers</span>
          </button>

          <button
            onClick={openFollowing}
            className="hover:underline focus:outline-none"
          >
            <span className="font-extrabold text-slate-900 dark:text-white text-sm mr-1">
              {user._count?.following || 0}
            </span>
            <span className="text-slate-500 dark:text-zinc-400">Following</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {isSelf && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={user}
          onProfileUpdated={(updated) => {
            onUserUpdated(updated);
          }}
        />
      )}

      <FollowListModal
        isOpen={showFollowModal}
        onClose={() => setShowFollowModal(false)}
        username={user.username}
        initialTab={followModalTab}
      />
    </div>
  );
}
