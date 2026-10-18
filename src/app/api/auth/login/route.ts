import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, signJWT, COOKIE_NAME } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { identifier, password } = result.data;
    const cleanId = identifier.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: cleanId }, { email: cleanId }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid username/email or password' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid username/email or password' },
        { status: 401 }
      );
    }

    const token = await signJWT({ userId: user.id, username: user.username });

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      coverUrl: user.coverUrl,
      bio: user.bio,
      website: user.website,
      location: user.location,
      createdAt: user.createdAt,
    };

    const response = NextResponse.json({
      success: true,
      data: safeUser,
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
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}
