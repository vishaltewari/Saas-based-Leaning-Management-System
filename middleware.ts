import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, request) => {
  // Allow iframe embedding
  const response = NextResponse.next();
  
  // Set headers to allow iframe embedding
  response.headers.set('X-Frame-Options', 'ALLOWALL');
  response.headers.set('Content-Security-Policy', 'frame-ancestors *;');
  
  // Configure cookies for iframe context
  if (request.headers.get('sec-fetch-dest') === 'iframe') {
    response.cookies.set({
      name: '__clerk_iframe',
      value: 'true',
      sameSite: 'none',
      secure: true,
    });
  }

  if (!isPublicRoute(request)) {
    const { userId } = await auth();
    if (!userId) {
      // Don't redirect in iframe context, just return unauthorized
      if (request.headers.get('sec-fetch-dest') === 'iframe') {
        return new Response('Unauthorized', { status: 401 });
      }
    }
  }
  
  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}