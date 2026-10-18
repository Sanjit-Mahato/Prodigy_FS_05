import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { commentId } = params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        post: {
          select: { authorId: true },
        },
      },
    });

    if (!comment) {
      return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 });
    }

    // Author of comment OR author of post can delete
    if (comment.userId !== user.id && comment.post.authorId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'You are not authorized to delete this comment' },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete comment' }, { status: 500 });
  }
}
