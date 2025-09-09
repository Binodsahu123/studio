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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2, Copy, Check } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  originalText: z.string().min(20, 'Please enter at least 20 characters to rewrite.'),
  rewriteInstruction: z.string().min(5, 'Please provide a clear instruction.'),
  language: z.string().min(1, 'Please select a language.'),
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
      rewriteInstruction: '',
      language: 'English',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRewrittenContent(null);
    try {
      const input: RewriteContentInput = values;
      const result: RewriteContentOutput = await rewriteContent(input);
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
    navigator.clipboard.writeText(rewrittenContent).then(() => {
      setIsCopied(true);
      toast({ title: "Copied HTML to clipboard!" });
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Wand2 className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-3xl">Advanced Content Rewriter</CardTitle>
                    <CardDescription>Refine, rephrase, or completely change the tone of your existing content.</CardDescription>
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
                          <FormLabel>Original Content</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Paste the content you want to rewrite here..." {...field} rows={10} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rewriteInstruction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rewrite Instruction</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 'Make this sound more professional' or 'Simplify for a beginner'" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Output Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                  <SelectItem value="English">English</SelectItem>
                                  <SelectItem value="Hindi">Hindi</SelectItem>
                              </SelectContent>
                            </Select>
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
          </div>
          
          {(isLoading || rewrittenContent) && (
            <div className="md:col-span-2">
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
                            Copy HTML
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
