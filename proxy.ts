import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  const isPrivateRoute =
    pathname.startsWith('/profile') || pathname.startsWith('/notes');

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
