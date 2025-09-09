// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const LICENSE_FILE_PATH = path.join(process.cwd(), '.license');

async function isActivated() {
  try {
    await fs.stat(LICENSE_FILE_PATH);
    return true;
  } catch (error) {
    // If the file doesn't exist, stat will throw an error.
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to the activation page and Next.js internal assets
  if (pathname.startsWith('/activate') || pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  const activated = await isActivated();

  if (!activated) {
    // If not activated, redirect any other path to the activation page.
    return NextResponse.redirect(new URL('/activate', request.url));
  }

  // If activated, allow the request to proceed.
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
