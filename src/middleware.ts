
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// This must be declared at the top to tell Next.js to use the Node.js runtime.
export const runtime = 'nodejs';

const LICENSE_FILE_PATH = path.join(process.cwd(), '.license');

async function isActivated() {
  try {
    await fs.stat(LICENSE_FILE_PATH);
    return true;
  } catch (error) {
    // This will catch the error if the file doesn't exist, which is expected.
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // These are public paths that should not be protected by the activation check.
  // This includes the activation page itself and Next.js internal assets.
  const publicPaths = ['/activate', '/_next', '/favicon.ico'];
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const activated = await isActivated();

  if (!activated) {
    // If the script is not activated, redirect any other request to the activation page.
    return NextResponse.redirect(new URL('/activate', request.url));
  }

  // If activated, proceed with the original request.
  return NextResponse.next();
}

// This configures the middleware to run on all paths except for specific static assets and API routes.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
