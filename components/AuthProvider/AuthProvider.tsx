'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession, getMe, logout } from '@/lib/api/clientApi';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const { user, setUser, clearIsAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const isPrivate =
    pathname.startsWith('/profile') || pathname.startsWith('/notes');

  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await checkSession();
        if (session.success) {
          const userData = await getMe();
          setUser(userData);
        } else {
          // If explicit session check fails, clear state
          clearIsAuthenticated();
        }
      } catch (error) {
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, clearIsAuthenticated]);

  useEffect(() => {
    if (!loading && isPrivate) {
      checkSession().then((res) => {
        if (!res.success) {
          logout().then(() => {
            clearIsAuthenticated();
            router.push('/sign-in');
          });
        }
      });
    }
  }, [pathname, loading, isPrivate, router, clearIsAuthenticated]);

  if (loading) {
    // Simple loader
    return <div>Loading...</div>;
  }

  // If loading is done, and it's private and we are not authenticated (session check might be async, but store should be updated or we trust the initial check)
  // The second useEffect handles re-verification on route change.
  // For initial load, if private and checkSession failed => we should redirect.
  // However, `proxy` or middleware should handle the initial server-side/redirect protection.
  // This component handles client-side transitions.

  return <>{children}</>;
}
