import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from '@/lib/api/serverApi';

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');

  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up');

  const isPrivateRoute =
    pathname.startsWith('/profile') ||
    pathname.startsWith('/notes');

  // Якщо нема accessToken, але є refreshToken → пробуємо відновити
  if (!accessToken && refreshToken) {
    const session = await checkSession();

    if (!session.success && isPrivateRoute) {
      return NextResponse.redirect(
        new URL('/sign-in', request.url)
      );
    }
  }

  if (!accessToken && isPrivateRoute) {
    return NextResponse.redirect(
      new URL('/sign-in', request.url)
    );
  }

  if (accessToken && isAuthRoute) {
    return NextResponse.redirect(
      new URL('/profile', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/sign-in',
    '/sign-up',
  ],
};