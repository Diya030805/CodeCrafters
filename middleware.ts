import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

function getSecureUrl(path: string, req: Request): URL {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || new URL(req.url).host;
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
  const protocol = isLocal ? 'http' : 'https';
  return new URL(path, `${protocol}://${host}`);
}

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // If user is already authenticated and visits sign-in or sign-up, redirect to dashboard
  if (userId && isAuthRoute(request)) {
    const dashboardUrl = getSecureUrl('/dashboard', request);
    return NextResponse.redirect(dashboardUrl);
  }

  // Protect all non-public routes (e.g. /dashboard)
  if (!userId && !isPublicRoute(request)) {
    const signInUrl = getSecureUrl('/sign-in', request);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

