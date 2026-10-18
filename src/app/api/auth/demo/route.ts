import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signJWT, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username } = body;

    const validUsernames = ['alex_r', 'sarah_c', 'leo_v', 'maya_p'];
    const targetUsername = validUsernames.includes(username) ? username : 'alex_r';

    const user = await prisma.user.findUnique({
      where: { username: targetUsername },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        avatarUrl: true,
        coverUrl: true,
        bio: true,
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
      return NextResponse.json(
        { success: false, error: 'Demo user not found. Please re-seed database.' },
        { status: 404 }
      );
    }

    const token = await signJWT({ userId: user.id, username: user.username });

    const response = NextResponse.json({
      success: true,
      data: user,
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Demo auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to switch demo user' },
      { status: 500 }
    );
  }
}
