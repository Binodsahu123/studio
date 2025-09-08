// src/app/seo/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateImprovedSeoKeywords, GenerateImprovedSeoKeywordsInput, GenerateImprovedSeoKeywordsOutput } from '@/ai/flows/generate-improved-seo-keywords';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, TrendingUp } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  originalKeywords: z.string().min(1, 'Please enter some keywords.'),
  contentTopic: z.string().min(1, 'Please enter a content topic.'),
});

export default function SeoPage() {
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originalKeywords: '',
      contentTopic: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedKeywords([]);
    try {
      const input: GenerateImprovedSeoKeywordsInput = values;
      const result: GenerateImprovedSeoKeywordsOutput = await generateImprovedSeoKeywords(input);
      setGeneratedKeywords(result.improvedKeywords);
    } catch (error) {
      console.error('Error generating SEO keywords:', error);
      toast({
        title: "Error Generating Keywords",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-3xl">SEO Keyword Generator</CardTitle>
                <CardDescription>Enter your topic and current keywords to get improved, high-ranking suggestions.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="contentTopic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Digital marketing for small businesses'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="originalKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Current Keywords</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter your current keywords, separated by commas..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} size="lg">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Keywords
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
            <Card className="max-w-2xl mx-auto mt-8">
              <CardHeader>
                <CardTitle>Generating...</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </CardContent>
            </Card>
        )}

        {generatedKeywords.length > 0 && (
          <Card className="max-w-2xl mx-auto mt-8">
            <CardHeader>
              <CardTitle>Improved SEO Keywords</CardTitle>
              <CardDescription>Here are the AI-suggested keywords to boost your content's ranking.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {generatedKeywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-base px-3 py-1">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
