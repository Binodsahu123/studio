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
import { Loader2, Hash, Copy, Check, Youtube, Instagram, Tags } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  topic: z.string().min(3, 'Please enter a topic with at least 3 characters.'),
});

const categories = [
  'Food', 'Travel', 'Fashion', 'Fitness', 'Tech', 'Art', 
  'Music', 'Photography', 'Marketing', 'Gaming', 'Beauty', 
  'Lifestyle', 'DIY', 'Education', 'Finance', 'Health'
];

export default function HashtagGeneratorPage() {
  const [results, setResults] = useState<GenerateHashtagsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHashtagCopied, setIsHashtagCopied] = useState(false);
  const [isTagsCopied, setIsTagsCopied] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState<'Instagram' | 'YouTube' | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  const handleGenerate = async (topic: string, platform: 'Instagram' | 'YouTube') => {
    if (!topic) {
        toast({ title: "Please enter a topic first.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    setResults(null);
    setCurrentPlatform(platform);
    try {
      const input: GenerateHashtagsInput = { topic, platform };
      const result: GenerateHashtagsOutput = await generateHashtags(input);
      setResults(result);
    } catch (error) {
      console.error(`Error generating ${platform} assets:`, error);
      toast({
        title: "Error Generating Assets",
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

  const handleCopy = (text: string, type: 'hashtags' | 'tags') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'hashtags') {
        setIsHashtagCopied(true);
        toast({ title: "Copied hashtags to clipboard!" });
        setTimeout(() => setIsHashtagCopied(false), 2000);
      } else {
        setIsTagsCopied(true);
        toast({ title: "Copied SEO tags to clipboard!" });
        setTimeout(() => setIsTagsCopied(false), 2000);
      }
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
                <CardTitle className="text-3xl">AI Hashtag & Tag Generator</CardTitle>
                <CardDescription>Generate viral hashtags and SEO tags for your content.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <Card className="bg-secondary/50">
              <CardHeader>
                <CardTitle className="text-xl">Generate from a Title</CardTitle>
                <CardDescription>Enter a topic to get relevant hashtags and tags.</CardDescription>
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
                    <div className="flex flex-wrap gap-4">
                        <Button type="submit" disabled={isLoading}>
                          {isLoading && currentPlatform === 'Instagram' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          <Instagram className="mr-2 h-4 w-4" /> Generate for Instagram
                        </Button>
                         <Button type="button" onClick={() => handleGenerate(form.getValues('topic'), 'YouTube')} disabled={isLoading || !form.getValues('topic')}>
                          {isLoading && currentPlatform === 'YouTube' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          <Youtube className="mr-2 h-4 w-4" /> Generate for YouTube
                        </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
               <CardHeader>
                <CardTitle className="text-xl">Discover by Category</CardTitle>
                <CardDescription>Get popular assets for different categories and platforms.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Instagram className="h-5 w-5" /> Instagram Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <Button key={`insta-${category}`} onClick={() => handleGenerate(category, 'Instagram')} disabled={isLoading} variant="outline" size="sm">
                            {isLoading && currentPlatform === 'Instagram' && results === null ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {category}
                        </Button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Youtube className="h-5 w-5" /> YouTube Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <Button key={`yt-${category}`} onClick={() => handleGenerate(category, 'YouTube')} disabled={isLoading} variant="outline" size="sm">
                            {isLoading && currentPlatform === 'YouTube' && results === null ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {category}
                        </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          
            {(isLoading || results) && (
              <div className="space-y-6 pt-4">
                {isLoading ? (
                  <Card>
                    <CardHeader>
                        <CardTitle>Generating...</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="mt-4">Generating assets...</p>
                    </CardContent>
                  </Card>
                ) : results && (
                  <>
                    {/* Hashtags Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2"><Hash className="h-5 w-5"/> Generated Hashtags</CardTitle>
                                {results.hashtags && results.hashtags.length > 0 && (
                                    <Button variant="outline" size="sm" onClick={() => handleCopy(results.hashtags.join(' '), 'hashtags')} disabled={isHashtagCopied}>
                                        {isHashtagCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                        Copy All
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="min-h-[100px]">
                            {results.hashtags && results.hashtags.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                {results.hashtags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-sm font-normal cursor-pointer hover:bg-primary/10" onClick={() => {
                                      navigator.clipboard.writeText(tag);
                                      toast({title: `Copied "${tag}"`});
                                    }}>
                                    {tag}
                                    </Badge>
                                ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                   <p>No hashtags were generated. Please try a different topic.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* SEO Tags Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2"><Tags className="h-5 w-5"/> Generated SEO Tags</CardTitle>
                                {results.tags && (
                                    <Button variant="outline" size="sm" onClick={() => handleCopy(results.tags, 'tags')} disabled={isTagsCopied}>
                                        {isTagsCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                        Copy All
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="min-h-[60px]">
                            {results.tags ? (
                                <p className="text-sm text-muted-foreground">{results.tags}</p>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                   <p>No SEO tags were generated.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
