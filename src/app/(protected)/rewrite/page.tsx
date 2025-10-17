// src/app/rewrite/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { rewriteContent, RewriteContentInput, RewriteContentOutput } from '@/ai/flows/rewrite-content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, Copy, Check, HelpCircle } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  originalText: z.string().min(20, 'Please enter at least 20 characters to rewrite.'),
  instructions: z.string().min(20, 'Please provide a sample text of at least 20 characters for tone reference.'),
});

export default function RewritePage() {
  const [rewrittenContent, setRewrittenContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originalText: '',
      instructions: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRewrittenContent(null);
    try {
      const result: RewriteContentOutput = await rewriteContent(values);
      setRewrittenContent(result.rewrittenText);
    } catch (error) {
      console.error('Error rewriting content:', error);
      toast({
        title: "Error Rewriting Content",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = () => {
    if (!rewrittenContent) return;
    const el = document.createElement('div');
    el.innerHTML = rewrittenContent;
    const plainText = el.textContent || el.innerText || "";
    navigator.clipboard.writeText(plainText).then(() => {
      setIsCopied(true);
      toast({ title: "Copied text to clipboard!" });
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="space-y-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Wand2 className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-3xl">Content Rewriter</CardTitle>
                  <CardDescription>Refine your text by providing a sample of the desired tone and style.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="originalText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Original Content</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Paste the content you want to rewrite here..." {...field} rows={10} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rewrite Instructions / Tone Reference</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Paste a sample text here that has the tone and style you want the AI to adopt..." {...field} rows={6} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} size="lg">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Rewrite Content
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <HelpCircle className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>How to Use the Content Rewriter</CardTitle>
                  <CardDescription>Follow these simple steps to get the best results.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Your Original Content:</strong> Paste the article or text you want to change into this box. This is the content that the AI will rewrite.
                  </li>
                  <li>
                    <strong>Rewrite Instructions / Tone Reference:</strong> Paste a sample article or paragraph here that has the writing style you want. The AI will analyze this sample to understand the tone, sentence structure, and voice, and then apply that style to your original content.
                  </li>
                  <li>
                    <strong>Generate:</strong> Click the "Rewrite Content" button. The AI will generate a new version of your content that matches the style of your sample.
                  </li>
                </ol>
            </CardContent>
          </Card>

          {(isLoading || rewrittenContent) && (
            <div>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Rewritten Content</CardTitle>
                        <CardDescription>Here is the new version of your content.</CardDescription>
                    </div>
                     {rewrittenContent && (
                        <Button variant="outline" size="sm" onClick={handleCopy} disabled={isCopied}>
                            {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                            Copy Text
                        </Button>
                     )}
                  </div>
                </CardHeader>
                <CardContent className="min-h-[200px] bg-secondary rounded-md">
                  {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="mt-4">Rewriting in progress...</p>
                    </div>
                  )}
                  {!isLoading && rewrittenContent && (
                     <div
                        className="prose dark:prose-invert max-w-none p-6"
                        dangerouslySetInnerHTML={{ __html: rewrittenContent }}
                      />
                  )}
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
