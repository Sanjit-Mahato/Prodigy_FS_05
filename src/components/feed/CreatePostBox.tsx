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
      <div className="glass-panel rounded-3xl p-5 mb-6 text-center border-dashed border-2 border-slate-200 dark:border-zinc-800">
        <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">
          Want to share updates, photos, or videos?
        </p>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Use the <span className="font-semibold text-indigo-600 dark:text-indigo-400">Testing Persona</span> pill above to select Alex, Sarah, Leo, or Maya to post immediately!
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
    <div className="glass-panel rounded-3xl p-4 sm:p-5 mb-6 shadow-sm border border-slate-200/80 dark:border-zinc-800/80">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-3">
          <Avatar src={user.avatarUrl} alt={user.name} size="md" />
          <div className="flex-1">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={`What's on your mind, ${user.name.split(' ')[0]}? Share thoughts, #tags, or @mentions...`}
              rows={3}
              className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 resize-none focus:outline-none focus:ring-0 leading-relaxed"
            />

            {/* Media previews */}
            {mediaList.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3">
                {mediaList.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 group"
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
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                      title="Remove media"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-xs text-rose-500 font-medium my-2">
                {error}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-1">
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-500" />
                  <span>Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || mediaList.length >= 4}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  <Video className="w-4 h-4 text-indigo-500" />
                  <span>Video</span>
                </button>

                {uploading && (
                  <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 pl-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={(!caption.trim() && mediaList.length === 0) || submitting || uploading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-95"
              >
                {submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Post</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
