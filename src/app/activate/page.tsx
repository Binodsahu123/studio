// src/app/activate/page.tsx
'use server';

import { activateLicense } from '@/app/activate/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound } from 'lucide-react';

// This is a server component, so we can render the form and handle submission
// with a server action without needing client-side JavaScript.

export default async function ActivatePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <KeyRound className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl">Activate Your Script</CardTitle>
          <CardDescription>Enter your secret code to activate the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={activateLicense} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="licenseKey">Secret Code (License Key)</Label>
              <Input
                id="licenseKey"
                name="licenseKey"
                type="password"
                placeholder="Enter your secret code"
                required
                className="text-center"
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Activate
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground mt-4">
        Please enter the license key provided with your purchase to begin setup.
      </p>
    </div>
  );
}
