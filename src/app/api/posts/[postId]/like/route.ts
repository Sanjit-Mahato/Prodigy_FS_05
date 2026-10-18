import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

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

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    // Check if user already liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    let isLiked = false;

    if (existingLike) {
      // Remove like
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      isLiked = false;
    } else {
      // Add like
      await prisma.like.create({
        data: {
          userId: user.id,
          postId,
        },
      });
      isLiked = true;

      // Create notification for post author (if not self)
      if (post.authorId !== user.id) {
        await prisma.notification.create({
          data: {
            recipientId: post.authorId,
            actorId: user.id,
            type: 'LIKE',
            postId,
          },
        });
      }
    }

    // Get updated total likes count
    const likesCount = await prisma.like.count({
      where: { postId },
    });

    return NextResponse.json({
      success: true,
      data: {
        isLiked,
        likesCount,
      },
    });
  } catch (error) {
    console.error('Like toggle error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
