# Prodigy Social • Production-Ready Full-Stack Social Platform
### Prodigy InfoTech Internship — Task 05 (Prodigy_FS_05)

A modern, high-performance, responsive full-stack social media web application built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Prisma ORM with SQLite**.

---

## 🌟 Key Features

### 1. 🎨 Expressive User Profiles
- **Customizable Profiles**: Display name, `@username`, bio, location, website link, and joined date.
- **Media Banners**: High-resolution cover photo and profile avatar uploads with zoom on hover.
- **Social Counters**: Real-time post counts, follower counts, and following counts.
- **Followers & Following Modals**: Interactive popup to view and toggle follow/unfollow for any creator.
- **Profile Content Tabs**: Switch between standard feed view and Instagram/Pinterest-style photo & video grids.

### 2. 📸 Rich Multimedia Sharing & Posts
- **Multi-Media Attachments**: Support for single images, multi-image carousels (with swipe/arrow navigation and pagination dots), and high-definition video playback.
- **Media Pipeline**: Local upload handling with MIME validation, size limits (up to 20MB for images, 50MB for video), and preview thumbnails.
- **Hashtag (#) & Mention (@) Engine**: Automatically indexes `#hashtags` and `@mentions` into interactive clickable links that lead to tag feeds or creator profiles.

### 3. ❤️ Delightful Micro-Interactions & Engagement
- **Double-Tap Heart Bursts**: Double-tap anywhere on images or videos to trigger a vibrant heart particle burst animation powered by Framer Motion.
- **Optimistic UI Updates**: Instant like count increments and heart toggles with automatic rollback on error.
- **Nested Comment Threads**: Add top-level comments or reply directly to comments with relative timestamps ("2h", "35m", "Just now").
- **Native Share & Bookmark**: One-click link copy or Web Share API integration.

### 4. 🌐 Social Graph & Personalized Feeds
- **Follow / Unfollow System**: Connect with creators across the platform.
- **Dual Feed Modes**:
  - **"For You"**: Curated timeline across all public community posts.
  - **"Following"**: Focused timeline displaying content exclusively from followed accounts.

### 5. 🔥 Explore, Trending & Search
- **Top 10 Trending Hashtags**: Ranked dynamically based on post frequency.
- **Multi-Domain Search**: Instant search matching keywords across usernames, full names, captions, and tags.
- **Visual Masonry Grid**: Explore community photos and videos with hover statistics overlays (likes & comments count).

### 6. 🔔 Real-Time Notifications Center
- **Granular Activity Alerts**:
  - ❤️ Likes: *"Sarah Chen liked your post."*
  - 💬 Comments & Replies: *"Alex Rivera commented on your post."*
  - 👤 New Followers: *"Leo Vance started following you."*
  - 🏷️ Mentions: *"Maya Patel mentioned you in a post."*
- **Live Badge Counters**: Unread badges on both the desktop sidebar and mobile navigation bar with 15-second sync.
- **One-Click Read Actions**: Mark individual notifications or all notifications as read.

### 7. 🚀 Animated Homepage & 1-Click Demo Accounts
- **Animated Landing Hero**: 3D mesh gradient glowing background, floating simulated social cards, and live metrics.
- **1-Click Testing Personas**: Switch instantly between pre-seeded creator accounts:
  - **Alex Rivera** (`alex_r`) — UI/UX Architect
  - **Sarah Chen** (`sarah_c`) — Landscape Photographer
  - **Leo Vance** (`leo_v`) — 3D Motion Designer
  - **Maya Patel** (`maya_p`) — AI Researcher
- **Full Authentication**: Traditional registration and login flow with secure HTTP-only JWT cookies and `bcryptjs` password hashing.

### 8. 🌓 Theme & Responsive Design
- **Dark & Light Mode**: Seamless theme toggling with `next-themes` and zero flicker (FOUC).
- **Responsive Layouts**:
  - Desktop (1024px+): 3-column layout (Nav + Feed + Trending Sidebar).
  - Tablet (768px - 1023px): 2-column layout.
  - Mobile (<768px): Sticky header + bottom navigation bar.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router, Server & Client Components) |
| **Language** | TypeScript (Strict mode) |
| **Database & ORM** | Prisma ORM + SQLite (Zero external dependencies) |
| **Styling** | Tailwind CSS v3, CSS Variables, Glassmorphism |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Authentication** | JWT via `jose`, password hashing via `bcryptjs` |
| **Date Formatting** | `date-fns` |
| **Theme Management** | `next-themes` |

---

## 📦 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+ or v22+
- **npm**: v9+ or v10+

### 2. Installation
```bash
# Clone or navigate to the repository
cd /path/to/Prodigy_FS_05

# Install dependencies
npm install
```

### 3. Database Setup & Seeding
```bash
# Push Prisma schema to SQLite
npx prisma db push

# Seed demo users, posts, media, comments, and hashtags
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Pre-Configured Demo Accounts

All demo personas have the default password: **`password123`**.  
You can also use the **Testing Persona** dropdown in the navigation bar to switch between them with a single click:

| Name | Username | Email | Role |
| :--- | :--- | :--- | :--- |
| **Alex Rivera** | `alex_r` | `alex@example.com` | UI/UX Architect |
| **Sarah Chen** | `sarah_c` | `sarah@example.com` | Travel & Nature Photographer |
| **Leo Vance** | `leo_v` | `leo@example.com` | 3D Motion Designer |
| **Maya Patel** | `maya_p` | `maya@example.com` | AI Research Lead |

---

## 🗄️ Database Schema Overview

```
User (id, username, email, passwordHash, name, bio, avatarUrl, coverUrl, website, location)
 ├── Post (id, caption, authorId, createdAt)
 │    ├── Media (id, postId, url, type, aspectRatio, order)
 │    ├── Like (id, userId, postId)
 │    ├── Comment (id, content, postId, userId, parentId)
 │    └── PostHashtag (postId, hashtagId)
 ├── Follow (followerId, followingId)
 └── Notification (id, recipientId, actorId, type, postId, read)
```

---

## 📡 API Endpoints Reference

### Authentication
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in with credentials
- `POST /api/auth/logout` — Clear session cookie
- `GET /api/auth/me` — Fetch current session
- `POST /api/auth/demo` — 1-click persona login switch

### Posts & Interactions
- `GET /api/posts?feed={forYou|following}&tag={tag}&author={username}` — Fetch posts
- `POST /api/posts` — Create post with caption and media
- `GET /api/posts/[postId]` — Fetch single post details
- `DELETE /api/posts/[postId]` — Delete post (author only)
- `POST /api/posts/[postId]/like` — Toggle like / unlike
- `GET /api/posts/[postId]/comments` — Fetch comment thread
- `POST /api/posts/[postId]/comments` — Add comment or reply
- `DELETE /api/comments/[commentId]` — Delete comment

### Users & Social Graph
- `GET /api/users/[username]` — Fetch user profile
- `PATCH /api/users/profile` — Update current user profile
- `POST /api/users/[username]/follow` — Toggle follow / unfollow
- `GET /api/users/[username]/followers` — List user followers
- `GET /api/users/[username]/following` — List followed users

### Explore & Notifications
- `GET /api/explore/trending` — Top 10 trending hashtags
- `GET /api/explore/search?q={query}` — Search users, posts, and tags
- `GET /api/explore/suggested` — Suggested creators to follow
- `GET /api/notifications` — Fetch user notifications
- `PATCH /api/notifications` — Mark notifications as read
- `POST /api/upload` — Multi-part image/video upload handler

---

## 🧪 Verification & Production Build

To test production readiness:
```bash
npm run build
npm start
```
All routes compile statically or dynamically with zero TypeScript errors.

---

## 👨‍💻 Author & Contributor

- **Sanjit Kumar** — [@Sanjit-Mahato](https://github.com/Sanjit-Mahato)

---

## 📄 License

This project is created as part of the Prodigy InfoTech Full-Stack Web Development Internship (Task 05 - Prodigy_FS_05). Distributed under the MIT License.
