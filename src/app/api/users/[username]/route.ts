import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const currentUser = await getSessionUser();

    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
        website: true,
        location: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    let isFollowing = false;
    if (currentUser && currentUser.id !== user.id) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUser.id,
            followingId: user.id,
          },
        },
      });
      isFollowing = !!follow;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        isFollowing,
        isSelf: currentUser ? currentUser.id === user.id : false,
      },
    });
  } catch (error) {
    console.error('Fetch user error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
  }
}
