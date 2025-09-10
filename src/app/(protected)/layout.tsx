// src/app/(protected)/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

function isActivated() {
  const cookieStore = cookies();
  const activationCookie = cookieStore.get('activation');
  // Check if the cookie exists and has the expected value 'true'
  return activationCookie?.value === 'true';
}

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!isActivated()) {
    redirect('/activate');
  }

  return <>{children}</>;
}
