// src/app/generate/page.tsx
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateBlogTopic, GenerateBlogTopicInput, GenerateBlogTopicOutput } from '@/ai/flows/generate-blog-topic-from-prompt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const formSchema = z.object({
  prompt: z.string().min(1, 'Please enter a prompt.'),
});

export default function GeneratePage() {
  const [generatedTopics, setGeneratedTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedTopics([]);
    try {
      const input: GenerateBlogTopicInput = { prompt: values.prompt };
      const result: GenerateBlogTopicOutput = await generateBlogTopic(input);
      setGeneratedTopics(result.topics);
    } catch (error) {
      console.error('Error generating blog topics:', error);
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
            <CardTitle>Generate Blog Topics</CardTitle>
            <CardDescription>Enter a prompt and we&apos;ll generate some blog topic ideas for you.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Prompt</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Latest trends in digital marketing'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Topics
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>

        {generatedTopics.length > 0 && (
          <Card className="max-w-2xl mx-auto mt-8">
            <CardHeader>
              <CardTitle>Generated Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {generatedTopics.map((topic, index) => (
                  <li key={index} className="p-4 bg-secondary rounded-md">
                    {topic}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
