import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { username } = params;
    const targetUser = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: { id: true, username: true },
    });

    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (targetUser.id === user.id) {
      return NextResponse.json({ success: false, error: 'You cannot follow yourself' }, { status: 400 });
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUser.id,
        },
      },
    });

    let isFollowing = false;

    if (existingFollow) {
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      });
      isFollowing = false;
    } else {
      await prisma.follow.create({
        data: {
          followerId: user.id,
          followingId: targetUser.id,
        },
      });
      isFollowing = true;

      // Create notification
      await prisma.notification.create({
        data: {
          recipientId: targetUser.id,
          actorId: user.id,
          type: 'FOLLOW',
        },
      });
    }

    // Return new follower count for target user
    const followersCount = await prisma.follow.count({
      where: { followingId: targetUser.id },
    });

    return NextResponse.json({
      success: true,
      data: {
        isFollowing,
        followersCount,
      },
    });
  } catch (error) {
    console.error('Follow toggle error:', error);
    return NextResponse.json({ success: false, error: 'Failed to toggle follow' }, { status: 500 });
  }
}
