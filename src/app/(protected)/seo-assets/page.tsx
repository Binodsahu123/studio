// src/app/(protected)/seo-assets/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateSeoAssetsFromTitle, GenerateSeoAssetsFromTitleInput, GenerateSeoAssetsFromTitleOutput } from '@/ai/flows/generate-seo-assets-from-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Combine, Copy, Check } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  title: z.string().min(10, 'Please enter a title with at least 10 characters.'),
});

export default function SeoAssetsPage() {
  const [results, setResults] = useState<GenerateSeoAssetsFromTitleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResults(null);
    try {
      const result = await generateSeoAssetsFromTitle(values);
      setResults(result);
    } catch (error) {
      console.error('Error generating assets:', error);
      toast({
        title: "Error Generating Assets",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `Copied ${type} to clipboard!` });
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Combine className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-3xl">SEO Assets Generator</CardTitle>
                  <CardDescription>Enter a title to instantly generate SEO tags, hashtags, and a meta description.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 'A Complete Guide to Digital Marketing in 2024'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} size="lg">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Assets
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {isLoading && (
            <Card>
              <CardHeader>
                <CardTitle>Generating...</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </CardContent>
            </Card>
          )}

          {results && (
            <div className="space-y-6">
              {/* Meta Description */}
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle className="text-xl">Meta Description</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(results.description, 'Description')}>
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{results.description}</p>
                </CardContent>
              </Card>

              {/* SEO Tags */}
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle className="text-xl">SEO Tags</CardTitle>
                   <Button variant="outline" size="sm" onClick={() => handleCopy(results.tags, 'Tags')}>
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>
                </CardHeader>
                <CardContent>
                   <p className="text-sm text-muted-foreground">{results.tags}</p>
                </CardContent>
              </Card>

              {/* Hashtags */}
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle className="text-xl">Hashtags</CardTitle>
                   <Button variant="outline" size="sm" onClick={() => handleCopy(results.hashtags.join(' '), 'Hashtags')}>
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {results.hashtags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-sm font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
