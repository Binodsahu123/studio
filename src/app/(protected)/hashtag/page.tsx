// src/app/hashtag/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateHashtags, GenerateHashtagsInput, GenerateHashtagsOutput } from '@/ai/flows/generate-hashtags';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Hash, Copy, Check, Youtube, Instagram } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  topic: z.string().min(3, 'Please enter a topic with at least 3 characters.'),
});

export default function HashtagGeneratorPage() {
  const [hashtags, setHashtags] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  const handleGenerate = async (topic: string, platform: 'Instagram' | 'YouTube') => {
    setIsLoading(true);
    setHashtags(null);
    try {
      const input: GenerateHashtagsInput = { topic, platform };
      const result: GenerateHashtagsOutput = await generateHashtags(input);
      setHashtags(result.hashtags);
    } catch (error) {
      console.error(`Error generating ${platform} hashtags:`, error);
      toast({
        title: "Error Generating Hashtags",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onFormSubmit = (values: z.infer<typeof formSchema>) => {
    handleGenerate(values.topic, 'Instagram'); // Default to Instagram for topic-based generation
  };

  const handleCopy = () => {
    if (!hashtags || hashtags.length === 0) return;
    const hashtagText = hashtags.join(' ');
    navigator.clipboard.writeText(hashtagText).then(() => {
      setIsCopied(true);
      toast({ title: "Copied hashtags to clipboard!" });
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Hash className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-3xl">AI Hashtag Generator</CardTitle>
                <CardDescription>Generate viral and trending hashtags for Instagram and YouTube.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Generate from Title */}
            <Card className="bg-secondary/50">
              <CardHeader>
                <CardTitle className="text-xl">Generate Hashtags from a Title</CardTitle>
                <CardDescription>Enter a topic or title to get relevant hashtags.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Title or Topic</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 'summer vacation ideas' or 'latest tech gadgets'" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-4">
                        <Button type="submit" disabled={isLoading}>
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          <Instagram className="mr-2 h-4 w-4" /> Generate for Instagram
                        </Button>
                         <Button type="button" onClick={() => handleGenerate(form.getValues('topic'), 'YouTube')} disabled={isLoading || !form.getValues('topic')}>
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          <Youtube className="mr-2 h-4 w-4" /> Generate for YouTube
                        </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Trending Hashtags */}
            <Card>
               <CardHeader>
                <CardTitle className="text-xl">Discover Trending Hashtags</CardTitle>
                <CardDescription>Get a list of generally popular hashtags for different platforms.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="flex gap-4">
                    <Button onClick={() => handleGenerate('trending', 'Instagram')} disabled={isLoading} variant="outline">
                        <Instagram className="mr-2 h-4 w-4" /> Trending on Instagram
                    </Button>
                     <Button onClick={() => handleGenerate('trending', 'YouTube')} disabled={isLoading} variant="outline">
                         <Youtube className="mr-2 h-4 w-4" /> Trending on YouTube
                    </Button>
                 </div>
              </CardContent>
            </Card>
          
            {(isLoading || hashtags) && (
                <div className="space-y-4 pt-4">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Generated Hashtags</CardTitle>
                                {hashtags && hashtags.length > 0 && (
                                    <Button variant="outline" size="sm" onClick={handleCopy} disabled={isCopied}>
                                        {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                        Copy All
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="min-h-[150px]">
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                    <p className="mt-4">Generating hashtags...</p>
                                </div>
                            )}
                            {!isLoading && hashtags && (
                                <div className="flex flex-wrap gap-2">
                                {hashtags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-sm font-normal cursor-pointer hover:bg-primary/10" onClick={() => {
                                      navigator.clipboard.writeText(tag);
                                      toast({title: `Copied "${tag}"`});
                                    }}>
                                    {tag}
                                    </Badge>
                                ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
