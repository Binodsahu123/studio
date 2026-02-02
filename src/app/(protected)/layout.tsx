// src/app/(protected)/layout.tsx
import { ReactNode } from 'react';

// The activation check has been removed. 
// All routes within this layout are now public by default.
export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
