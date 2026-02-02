// src/app/activate/page.tsx
'use server';

import { redirect } from 'next/navigation';

// This page is no longer needed as the activation flow has been removed.
// We will redirect any user who lands here to the homepage.
export default async function ActivatePage() {
  redirect('/');
}
