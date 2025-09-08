// src/app/payment/page.tsx
'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, QrCode, Upload, Send } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

const formSchema = z.object({
  utr: z.string().min(12, 'Please enter a valid UTR/Transaction ID.'),
  screenshot: z
    .any()
    .refine((file) => file?.length == 1, 'Payment screenshot is required.')
    .refine((file) => file?.[0]?.size <= 5000000, `Max file size is 5MB.`)
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/jpg'].includes(file?.[0]?.type),
      'Only .jpg, .jpeg, and .png formats are supported.'
    ),
});

const plans: { [key: string]: { name: string; price: string } } = {
  monthly: { name: 'Monthly Plan', price: '₹29' },
  yearly: { name: 'Yearly Plan', price: '₹299' },
  lifetime: { name: 'Lifetime Plan', price: '₹999' },
};

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'monthly';
  const selectedPlan = plans[plan] || plans.monthly;

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      utr: '',
      screenshot: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Here you would typically handle the form submission,
    // e.g., upload the screenshot to a server and save the UTR.
    console.log({ ...values, plan: selectedPlan.name });

    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Payment Submitted!",
      description: "Your payment details have been received. We will verify and activate your plan shortly.",
    });

    form.reset();
    setIsLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <QrCode className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-3xl">Make Payment</CardTitle>
                  <CardDescription>Scan the QR code to complete your payment.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="p-4 border-2 border-dashed rounded-lg">
                <Image
                  src="https://picsum.photos/300/300"
                  alt="Payment QR Code"
                  width={300}
                  height={300}
                  className="rounded-md"
                  data-ai-hint="qr code"
                />
              </div>
              <div className="text-center">
                <p className="font-semibold">Scan with any UPI App</p>
                <p className="text-sm text-muted-foreground">(Google Pay, PhonePe, Paytm, etc.)</p>
                <p className="text-2xl font-bold text-primary mt-2">
                  Payable Amount: {selectedPlan.price}
                </p>
                <p className="text-sm font-semibold">for {selectedPlan.name}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Upload className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-3xl">Confirm Payment</CardTitle>
                  <CardDescription>Upload your payment details here after paying.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="utr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UTR / Transaction ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the 12-digit UTR from your app" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="screenshot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Screenshot</FormLabel>
                        <FormControl>
                          <Input type="file" accept="image/png, image/jpeg, image/jpg" onChange={(e) => field.onChange(e.target.files)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? 'Submitting...' : 'Submit Payment'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPageContent />
    </Suspense>
  )
}
