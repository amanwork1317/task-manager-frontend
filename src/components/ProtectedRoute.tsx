'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isPublicRoute = pathname === '/login' || 
                         pathname === '/signup' || 
                         pathname === '/forgot-password' || 
                         pathname.startsWith('/reset-password');

    if (!isLoading && !user && !isPublicRoute) {
      router.push('/login');
    }
  }, [user, isLoading, pathname, router]);


  const isPublicRoute = pathname === '/login' || 
                       pathname === '/signup' || 
                       pathname === '/forgot-password' || 
                       pathname.startsWith('/reset-password');

  // If we are on public routes, just show them
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Otherwise, only show children if user exists
  return user ? <>{children}</> : null;
}
