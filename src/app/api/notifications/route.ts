import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { recipientId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 30,
        include: {
          actor: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      }),
      prisma.notification.count({
        where: { recipientId: user.id, read: false },
      }),
    ]);

    // Also fetch associated posts if postId exists
    const postIds = Array.from(
      new Set(notifications.map((n) => n.postId).filter(Boolean))
    ) as string[];

    const posts = await prisma.post.findMany({
      where: { id: { in: postIds } },
      select: {
        id: true,
        caption: true,
        media: {
          take: 1,
          select: { url: true, type: true },
        },
      },
    });

    const postMap = new Map(posts.map((p) => [p.id, p]));

    const formatted = notifications.map((n) => ({
      ...n,
      post: n.postId ? postMap.get(n.postId) || null : null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        notifications: formatted,
        unreadCount,
      },
    });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { notificationId } = body;

    if (notificationId) {
      await prisma.notification.updateMany({
        where: { id: notificationId, recipientId: user.id },
        data: { read: true },
      });
    } else {
      // Mark all as read
      await prisma.notification.updateMany({
        where: { recipientId: user.id, read: false },
        data: { read: true },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications marked as read',
    });
  } catch (error) {
    console.error('Mark read error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}
