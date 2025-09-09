// src/app/activate/actions.ts
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { redirect } from 'next/navigation';

const LICENSE_FILE_PATH = path.join(process.cwd(), '.license');

// The secret key is defined directly here. It's safe because this is a server action
// and this code will not be sent to the client.
const SECRET_KEY = 'bbbbbhhhhhhhzzzzz007804888';

/**
 * Verifies the submitted license key and creates a lock file upon success.
 */
export async function activateLicense(formData: FormData) {
  const providedKey = formData.get('licenseKey') as string;

  if (providedKey && providedKey.trim() === SECRET_KEY) {
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
    // This is not a server error, but a user error.
    // NOTE: In a real app, you would redirect back to /activate?error=invalid_key
    throw new Error('The provided secret code is incorrect.');
  }

  redirect('/');
}
