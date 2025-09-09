// src/app/(protected)/layout.tsx
import { promises as fs } from 'fs';
import path from 'path';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

const LICENSE_FILE_PATH = path.join(process.cwd(), '.license');

async function isActivated() {
  try {
    await fs.stat(LICENSE_FILE_PATH);
    return true;
  } catch (error) {
    return false;
  }
}

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const activated = await isActivated();

  if (!activated) {
    redirect('/activate');
  }

  return <>{children}</>;
}
