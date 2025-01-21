import { getUser, getUserRole } from '../lib/auth';
import type { MiddlewareResponseHandler } from 'astro';

export async function authMiddleware(context: any, next: MiddlewareResponseHandler) {
  const user = await getUser();
  
  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register'];
  if (publicRoutes.includes(context.url.pathname)) {
    if (user) {
      return Response.redirect(new URL('/dashboard', context.url));
    }
    return next();
  }

  // Check if user is authenticated
  if (!user) {
    return Response.redirect(new URL('/auth/login', context.url));
  }

  // Check admin routes
  if (context.url.pathname.startsWith('/admin')) {
    const role = await getUserRole();
    if (role !== 'admin') {
      return Response.redirect(new URL('/dashboard', context.url));
    }
  }

  return next();
}