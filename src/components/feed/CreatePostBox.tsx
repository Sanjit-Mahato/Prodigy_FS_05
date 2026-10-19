'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { PostWithDetails } from '@/types';
import { Image as ImageIcon, Video, Sparkles, X, Loader2, Send } from 'lucide-react';
import Image from 'next/image';

interface CreatePostBoxProps {
  onPostCreated: (newPost: PostWithDetails) => void;
}

export function CreatePostBox({ onPostCreated }: CreatePostBoxProps) {
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [mediaList, setMediaList] = useState<{ url: string; type: 'IMAGE' | 'VIDEO' }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="bg-white dark:bg-[#0E1012] rounded-sm p-5 mb-6 text-center border border-dashed border-[#E5E7EB] dark:border-[#1F2429]">
        <p className="font-sans text-xs sm:text-sm font-medium text-[#0E1012] dark:text-white">
          Ready to publish posts, high-res photos, or 60fps video?
        </p>
        <p className="font-mono text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1.5 uppercase tracking-wider">
          Select a persona in the top header to post immediately.
        </p>
      </div>
    );
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (mediaList.length + files.length > 4) {
      setError('You can attach a maximum of 4 media files per post.');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success) {
          setMediaList((prev) => [
            ...prev,
            { url: data.data.url, type: data.data.type },
          ]);
        } else {
          setError(data.error || 'Upload failed');
        }
      }
    } catch {
      setError('Network error uploading files');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeMedia = (index: number) => {
    setMediaList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!caption.trim() && mediaList.length === 0) || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: caption.trim(),
          media: mediaList,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onPostCreated(data.data);
        setCaption('');
        setMediaList([]);
      } else {
        setError(data.error || 'Failed to create post');
      }
    } catch {
      setError('Network error creating post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0E1012] rounded-sm p-4 sm:p-5 mb-6 border border-[#E5E7EB] dark:border-[#1F2429] transition-colors">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-3">
          <Avatar src={user.avatarUrl} alt={user.name} size="md" />
          <div className="flex-1">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={`Share an update or perspective, ${user.name.split(' ')[0]}... (#tags or @mentions supported)`}
              rows={3}
              className="w-full bg-transparent font-sans text-xs sm:text-sm text-[#0E1012] dark:text-white placeholder-[#6B7280] resize-none focus:outline-none focus:ring-0 leading-relaxed"
            />

            {/* Media previews */}
            {mediaList.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3">
                {mediaList.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-sm overflow-hidden bg-slate-900 border border-[#E5E7EB] dark:border-[#1F2429] group"
                  >
                    {item.type === 'VIDEO' ? (
                      <video src={item.url} className="w-full h-full object-cover" />
                    ) : (
                      <Image
                        src={item.url}
                        alt="Upload preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-none bg-[#0E1012]/80 text-white hover:bg-[#C45A00] transition-colors"
                      title="Remove media"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="font-mono text-xs text-[#C45A00] my-2">
                {error}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB] dark:border-[#1F2429]">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
                  className="hidden"
                  onChange={handleFileSelect}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || mediaList.length >= 4}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-[#E5E7EB] dark:border-[#1F2429] font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white hover:bg-slate-50 dark:hover:bg-[#151722] transition-colors disabled:opacity-50"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#008B6B]" />
                  <span>Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || mediaList.length >= 4}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-[#E5E7EB] dark:border-[#1F2429] font-mono text-xs font-semibold uppercase tracking-wider text-[#0E1012] dark:text-white hover:bg-slate-50 dark:hover:bg-[#151722] transition-colors disabled:opacity-50"
                >
                  <Video className="w-3.5 h-3.5 text-[#2F4CFF]" />
                  <span>Video</span>
                </button>

                {uploading && (
                  <div className="flex items-center gap-1.5 font-mono text-xs text-[#2F4CFF] pl-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={(!caption.trim() && mediaList.length === 0) || submitting || uploading}
                className="flex items-center gap-2 px-5 py-2 rounded-none bg-[#0E1012] hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#0E1012] font-mono text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Publish</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
