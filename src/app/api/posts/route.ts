import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { extractHashtags, extractMentions } from '@/lib/parser';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createPostSchema = z.object({
  caption: z.string().max(2200).optional().nullable(),
  media: z
    .array(
      z.object({
        url: z.string().min(1),
        type: z.enum(['IMAGE', 'VIDEO']),
        aspectRatio: z.number().optional().nullable(),
      })
    )
    .optional()
    .default([]),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const feed = searchParams.get('feed') || 'forYou';
    const tag = searchParams.get('tag')?.toLowerCase();
    const authorUsername = searchParams.get('author');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);

    const currentUser = await getSessionUser();

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (tag) {
      where.hashtags = {
        some: {
          hashtag: {
            name: tag,
          },
        },
      };
    } else if (authorUsername) {
      where.author = {
        username: authorUsername,
      };
    } else if (feed === 'following' && currentUser) {
      // Find who the current user follows
      const following = await prisma.follow.findMany({
        where: { followerId: currentUser.id },
        select: { followingId: true },
      });
      const followingIds = following.map((f) => f.followingId);
      // Include own posts in following feed as well
      where.authorId = { in: [...followingIds, currentUser.id] };
    }

    const posts = await prisma.post.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            bio: true,
          },
        },
        media: {
          orderBy: { order: 'asc' },
        },
        hashtags: {
          select: {
            hashtag: {
              select: { name: true },
            },
          },
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
    });

    // Format posts to include isLiked flag
    const formatted = posts.map((post) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isLiked = currentUser ? (post as any).likes?.length > 0 : false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { likes, ...rest } = post as any;
      return {
        ...rest,
        isLiked,
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error('Fetch posts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = createPostSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { caption, media } = result.data;

    if ((!caption || !caption.trim()) && (!media || media.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Post must contain either a caption or media' },
        { status: 400 }
      );
    }

    // 1. Create post and media
    const post = await prisma.post.create({
      data: {
        authorId: user.id,
        caption: caption?.trim() || null,
        media: {
          create: media.map((item, index) => ({
            url: item.url,
            type: item.type,
            aspectRatio: item.aspectRatio || 1.33,
            order: index,
          })),
        },
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
        media: true,
      },
    });

    // 2. Extract and associate hashtags
    const hashtags = extractHashtags(caption);
    for (const tagName of hashtags) {
      const hashtag = await prisma.hashtag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });

      await prisma.postHashtag.create({
        data: {
          postId: post.id,
          hashtagId: hashtag.id,
        },
      });
    }

    // 3. Extract mentions and generate notifications
    const mentions = extractMentions(caption);
    if (mentions.length > 0) {
      const mentionedUsers = await prisma.user.findMany({
        where: {
          username: { in: mentions },
          id: { not: user.id }, // don't notify self
        },
        select: { id: true },
      });

      for (const mUser of mentionedUsers) {
        await prisma.notification.create({
          data: {
            recipientId: mUser.id,
            actorId: user.id,
            type: 'MENTION',
            postId: post.id,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...post,
        _count: { likes: 0, comments: 0 },
        isLiked: false,
      },
    });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
