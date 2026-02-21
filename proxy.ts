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

  const response = NextResponse.next();

  let isAuthenticated = !!accessToken;

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();
      const setCookie = sessionResponse.headers['set-cookie'];

      if (setCookie) {
        const cookiesArray = Array.isArray(setCookie)
          ? setCookie
          : [setCookie];

        for (const cookie of cookiesArray) {
          response.headers.append('Set-Cookie', cookie);
        }

        isAuthenticated = true;
      }
    } catch {
      if (isPrivateRoute) {
        return NextResponse.redirect(
          new URL('/sign-in', request.url)
        );
      }
    }
  }

  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(
      new URL('/sign-in', request.url)
    );
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(
      new URL('/', request.url)
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/sign-in',
    '/sign-up',
  ],
};