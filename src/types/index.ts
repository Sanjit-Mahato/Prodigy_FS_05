export interface SafeUser {
  id: string;
  username: string;
  email: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  website: string | null;
  location: string | null;
  createdAt: string | Date;
  _count?: {
    posts: number;
    followers: number;
    following: number;
  };
  isFollowing?: boolean;
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO' | string;
  aspectRatio: number | null;
  order: number;
}

export interface PostWithDetails {
  id: string;
  caption: string | null;
  authorId: string;
  author: SafeUser;
  createdAt: string | Date;
  updatedAt: string | Date;
  media: MediaItem[];
  _count: {
    likes: number;
    comments: number;
  };
  isLiked?: boolean;
  hashtags?: { hashtag: { name: string } }[];
}

export interface CommentWithAuthor {
  id: string;
  content: string;
  postId: string;
  userId: string;
  parentId: string | null;
  user: SafeUser;
  replies?: CommentWithAuthor[];
  createdAt: string | Date;
}

export interface NotificationWithActor {
  id: string;
  recipientId: string;
  actorId: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION';
  postId: string | null;
  read: boolean;
  createdAt: string | Date;
  actor: SafeUser;
  post?: {
    id: string;
    caption: string | null;
    media: MediaItem[];
  } | null;
}

export interface TrendingHashtag {
  id: string;
  name: string;
  count: number;
}
