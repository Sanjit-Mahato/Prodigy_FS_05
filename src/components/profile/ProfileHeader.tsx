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
    <div className="bg-white dark:bg-[#0E1012] rounded-sm overflow-hidden mb-6 border border-[#E5E7EB] dark:border-[#1F2429] transition-colors">
      {/* Cover Banner */}
      <div
        className="h-36 sm:h-48 w-full bg-[#0E1012] bg-cover bg-center relative border-b border-[#E5E7EB] dark:border-[#1F2429]"
        style={{
          backgroundImage: user.coverUrl ? `url(${user.coverUrl})` : undefined,
        }}
      >
        <div className="absolute inset-0 bg-[#0E1012]/30" />
      </div>

      {/* Main Profile Info */}
      <div className="px-5 sm:px-8 pb-6 pt-3 relative">
        {/* Avatar & Top Action Bar */}
        <div className="flex items-end justify-between -mt-14 sm:-mt-16 mb-4">
          <div className="relative">
            <Avatar
              src={user.avatarUrl}
              alt={user.name}
              size="2xl"
              className="border-2 border-white dark:border-[#0E1012]"
            />
          </div>

          <div className="flex items-center gap-2">
            {isSelf ? (
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-none border border-[#E5E7EB] dark:border-[#1F2429] hover:bg-slate-50 dark:hover:bg-[#151722] font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : currentUser ? (
              <button
                onClick={handleFollowToggle}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-none font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isFollowing
                    ? 'bg-slate-100 dark:bg-[#151722] text-[#6B7280] border border-[#E5E7EB] dark:border-[#1F2429]'
                    : 'bg-[#0E1012] hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#0E1012]'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#008B6B]" />
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
            <h1 className="font-sans text-xl sm:text-2xl font-medium text-[#0E1012] dark:text-white tracking-tight">
              {user.name}
            </h1>
            <p className="font-mono text-xs text-[#6B7280]">
              @{user.username}
            </p>
          </div>

          {user.bio && (
            <p className="font-sans text-xs sm:text-sm text-[#0E1012] dark:text-slate-200 whitespace-pre-line leading-relaxed max-w-2xl">
              {user.bio}
            </p>
          )}

          {/* Metadata badges: location, website, joined date */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs text-[#6B7280] pt-1">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
                {user.location}
              </span>
            )}

            {user.website && (
              <a
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[#2F4CFF] hover:underline"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            )}

            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
              Joined {formatFullDate(user.createdAt)}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 pt-3 border-t border-[#E5E7EB] dark:border-[#1F2429] font-mono text-xs">
          <div>
            <span className="font-semibold text-[#0E1012] dark:text-white text-sm mr-1.5">
              {user._count?.posts || 0}
            </span>
            <span className="text-[#6B7280] uppercase tracking-wider text-[11px]">Posts</span>
          </div>

          <button
            onClick={openFollowers}
            className="hover:text-[#2F4CFF] focus:outline-none transition-colors"
          >
            <span className="font-semibold text-[#0E1012] dark:text-white text-sm mr-1.5">
              {followersCount}
            </span>
            <span className="text-[#6B7280] uppercase tracking-wider text-[11px]">Followers</span>
          </button>

          <button
            onClick={openFollowing}
            className="hover:text-[#2F4CFF] focus:outline-none transition-colors"
          >
            <span className="font-semibold text-[#0E1012] dark:text-white text-sm mr-1.5">
              {user._count?.following || 0}
            </span>
            <span className="text-[#6B7280] uppercase tracking-wider text-[11px]">Following</span>
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
