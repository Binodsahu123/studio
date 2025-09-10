// src/app/activate/actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// The secret key is defined directly here. It's safe because this is a server action
// and this code will not be sent to the client.
const SECRET_KEY = 'bbbbbhhhhhhhzzzzz007804888';

/**
 * Verifies the submitted license key and sets a cookie upon success.
 */
export async function activateLicense(formData: FormData) {
  const providedKey = formData.get('licenseKey') as string;

  if (providedKey && providedKey.trim() === SECRET_KEY) {
    try {
      // Set a secure, http-only cookie to mark activation
      cookies().set('activation', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        // Set a long expiry date for the activation cookie
        maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
      });
    } catch (error) {
      console.error('Failed to set activation cookie:', error);
      throw new Error('Could not activate the license. An error occurred while setting the activation status.');
    }
  } else {
    // This is not a server error, but a user error.
    // NOTE: In a real app, you would redirect back to /activate?error=invalid_key
    throw new Error('The provided secret code is incorrect.');
  }

  redirect('/');
}
