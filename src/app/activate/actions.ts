// src/app/activate/actions.ts
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { redirect } from 'next/navigation';

const LICENSE_FILE_PATH = path.join(process.cwd(), '.license');

/**
 * Verifies the submitted license key and creates a lock file upon success.
 */
export async function activateLicense(formData: FormData) {
  const providedKey = formData.get('licenseKey') as string;
  const encodedKey = process.env.LICENSE_KEY;

  if (!encodedKey) {
    // This is a server-side configuration error.
    throw new Error('LICENSE_KEY is not set in the environment variables.');
  }

  // Decode the base64 key from environment variables
  const secretKey = Buffer.from(encodedKey, 'base64').toString('utf-8');

  if (providedKey && providedKey.trim() === secretKey.trim()) {
    try {
      // Create a simple license file to indicate activation.
      const licenseData = JSON.stringify({
        activatedAt: new Date().toISOString(),
        keyUsed: providedKey.substring(0, 4) + '****', // Store a redacted version for reference
      });
      await fs.writeFile(LICENSE_FILE_PATH, licenseData);
    } catch (error) {
      console.error('Failed to write license file:', error);
      throw new Error('Could not activate the license. Please check file permissions.');
    }
  } else {
    // This is not a server error, but a user error. We should handle this gracefully.
    // For simplicity, we'll throw an error, but a real app might redirect back with a query param.
    // NOTE: In a real app, you would redirect back to /activate?error=invalid_key
    throw new Error('The provided secret code is incorrect.');
  }

  redirect('/');
}
