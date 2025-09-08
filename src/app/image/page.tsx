// src/app/image/page.tsx
'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Construction } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ImagePageComingSoon() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
             <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                <Construction className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl mt-4">Feature Coming Soon!</CardTitle>
            <CardDescription>Our AI Image Generator is currently under development.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We are working hard to bring you a powerful tool to create stunning visuals from text. Please check back later!
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
