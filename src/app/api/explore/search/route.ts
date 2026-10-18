import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim() || '';
    const type = searchParams.get('type') || 'all'; // 'all', 'users', 'posts', 'tags'

    if (!query) {
      return NextResponse.json({
        success: true,
        data: { users: [], posts: [], tags: [] },
      });
    }

    const currentUser = await getSessionUser();

    // 1. Search Users
    let users: any[] = [];
    if (type === 'all' || type === 'users') {
      users = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query } },
            { name: { contains: query } },
          ],
        },
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
          bio: true,
          _count: {
            select: { followers: true, posts: true },
          },
        },
        take: 8,
      });

      if (currentUser) {
        const myFollows = await prisma.follow.findMany({
          where: { followerId: currentUser.id },
          select: { followingId: true },
        });
        const followingSet = new Set(myFollows.map((f) => f.followingId));
        users = users.map((u) => ({
          ...u,
          isFollowing: followingSet.has(u.id),
          isSelf: currentUser.id === u.id,
        }));
      }
    }

    // 2. Search Posts
    let posts: any[] = [];
    if (type === 'all' || type === 'posts') {
      posts = await prisma.post.findMany({
        where: {
          OR: [
            { caption: { contains: query } },
            {
              hashtags: {
                some: {
                  hashtag: {
                    name: { contains: query.replace(/^#/, '').toLowerCase() },
                  },
                },
              },
            },
          ],
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
            },
          },
          media: {
            orderBy: { order: 'asc' },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          ...(currentUser
            ? {
                likes: {
                  where: { userId: currentUser.id },
                  select: { userId: true },
                },
              }
            : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: 12,
      });

      posts = posts.map((post) => {
        const isLiked = currentUser ? post.likes?.length > 0 : false;
        const { likes, ...rest } = post;
        return { ...rest, isLiked };
      });
    }

    // 3. Search Hashtags
    let tags: any[] = [];
    if (type === 'all' || type === 'tags') {
      const cleanTag = query.replace(/^#/, '').toLowerCase();
      tags = await prisma.hashtag.findMany({
        where: {
          name: { contains: cleanTag },
        },
        include: {
          _count: {
            select: { posts: true },
          },
        },
        orderBy: {
          posts: {
            _count: 'desc',
          },
        },
        take: 6,
      });
      tags = tags.map((t) => ({
        id: t.id,
        name: t.name,
        count: t._count.posts,
      }));
    }

    return NextResponse.json({
      success: true,
      data: {
        users,
        posts,
        tags,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ success: false, error: 'Search failed' }, { status: 500 });
  }
}
