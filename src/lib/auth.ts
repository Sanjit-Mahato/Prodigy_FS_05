import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from './db';
import { SafeUser } from '@/types';

const SECRET_KEY = process.env.JWT_SECRET || 'prodigy_fs_05_default_secret_key_change_in_prod';
const key = new TextEncoder().encode(SECRET_KEY);

export const COOKIE_NAME = 'auth_token';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signJWT(payload: { userId: string; username: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(key);
}

export async function verifyJWT(token: string): Promise<{ userId: string; username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as { userId: string; username: string };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SafeUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifyJWT(token);
    if (!payload?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
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

    return user;
  } catch (error) {
    console.error('getSessionUser error:', error);
    return null;
  }
}
