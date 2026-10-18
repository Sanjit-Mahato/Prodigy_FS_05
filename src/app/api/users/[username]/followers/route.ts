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

    const targetUser = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: { id: true },
    });

    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const followers = await prisma.follow.findMany({
      where: { followingId: targetUser.id },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            bio: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Check if current user follows each of these followers
    let followingSet = new Set<string>();
    if (currentUser) {
      const myFollows = await prisma.follow.findMany({
        where: { followerId: currentUser.id },
        select: { followingId: true },
      });
      followingSet = new Set(myFollows.map((f) => f.followingId));
    }

    const formatted = followers.map((item) => ({
      ...item.follower,
      isFollowing: currentUser ? followingSet.has(item.follower.id) : false,
      isSelf: currentUser ? currentUser.id === item.follower.id : false,
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error('Fetch followers error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch followers' }, { status: 500 });
  }
}
