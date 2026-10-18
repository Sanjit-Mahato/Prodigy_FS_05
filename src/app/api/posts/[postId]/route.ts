import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    const currentUser = await getSessionUser();

    const post = await prisma.post.findUnique({
      where: { id: postId },
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

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isLiked = currentUser ? (post as any).likes?.length > 0 : false;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { likes, ...rest } = post as any;

    return NextResponse.json({
      success: true,
      data: {
        ...rest,
        isLiked,
      },
    });
  } catch (error) {
    console.error('Fetch post error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function DELETE(
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
      select: { authorId: true },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    if (post.authorId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'You are not authorized to delete this post' },
        { status: 403 }
      );
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 });
  }
}
