import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1).max(1000),
  parentId: z.string().optional().nullable(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // top-level comments
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error('Fetch comments error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = params;
    const body = await req.json();
    const result = commentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { content, parentId } = result.data;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId,
        userId: user.id,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
        replies: true,
      },
    });

    // Notify post author (if not self)
    if (post.authorId !== user.id) {
      await prisma.notification.create({
        data: {
          recipientId: post.authorId,
          actorId: user.id,
          type: 'COMMENT',
          postId,
        },
      });
    }

    // If it's a reply to another user's comment, also notify parent author
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { userId: true },
      });

      if (parentComment && parentComment.userId !== user.id && parentComment.userId !== post.authorId) {
        await prisma.notification.create({
          data: {
            recipientId: parentComment.userId,
            actorId: user.id,
            type: 'COMMENT',
            postId,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
