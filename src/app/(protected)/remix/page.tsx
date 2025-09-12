// src/app/(protected)/remix/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { remixArticle, RemixArticleInput, toneExamples } from '@/ai/flows/remix-article';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Blend, Copy, Check } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const toneCategories = Object.keys(toneExamples).map(key => ({ value: key, label: key }));

const formSchema = z.object({
  sourceArticles: z.string().min(100, 'Please enter at least 100 characters from source articles.'),
  toneCategory: z.string().min(1, 'Please select a tone category.'),
  toneReferenceArticle: z.string().min(50, 'The tone reference article must have at least 50 characters.'),
});

export default function RemixPage() {
  const [remixedHtml, setRemixedHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHtmlCopied, setIsHtmlCopied] = useState(false);
  const [isTextCopied, setIsTextCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceArticles: '',
      toneCategory: 'Casual Blog Post',
      toneReferenceArticle: toneExamples['Casual Blog Post'],
    },
  });

  const selectedCategory = form.watch('toneCategory');

  useEffect(() => {
    form.setValue('toneReferenceArticle', toneExamples[selectedCategory] || '');
  }, [selectedCategory, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRemixedHtml(null);
    try {
      const input: RemixArticleInput = {
        sourceArticles: values.sourceArticles,
        toneReferenceArticle: values.toneReferenceArticle,
      };
      const result = await remixArticle(input);
      setRemixedHtml(result.remixedArticleHtml);
    } catch (error) {
      console.error('Error remixing article:', error);
      toast({
        title: "Error Remixing Article",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleCopy = (text: string, type: 'HTML' | 'Text') => {
    navigator.clipboard.writeText(text).then(() => {
        if (type === 'HTML') {
            setIsHtmlCopied(true);
            toast({ title: "Copied HTML to clipboard!" });
            setTimeout(() => setIsHtmlCopied(false), 2000);
        } else {
            setIsTextCopied(true);
            toast({ title: "Copied text to clipboard!" });
            setTimeout(() => setIsTextCopied(false), 2000);
        }
    });
  };

  const handleCopyText = () => {
    if (!remixedHtml) return;
    const el = document.createElement('div');
    el.innerHTML = remixedHtml;
    const plainText = el.textContent || el.innerText || "";
    handleCopy(plainText, 'Text');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Blend className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-3xl">AI Article Mixer & Rephraser</CardTitle>
                    <CardDescription>Combine multiple articles and adopt a professional tone from a predefined category.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="sourceArticles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>1. Source Article(s) Content</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Paste content from one or more source articles here..." {...field} rows={12} />
                          </FormControl>
                           <FormDescription>Combine content from various websites here. This will be the source of information.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                        control={form.control}
                        name="toneCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>2. Choose a Tone Category</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a tone..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {toneCategories.map(category => (
                                    <SelectItem key={category.value} value={category.value}>
                                        {category.label}
                                    </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>This will auto-fill the tone reference article below.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                     <FormField
                      control={form.control}
                      name="toneReferenceArticle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>3. Tone Reference Article (Editable)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="The sample article for the selected tone will appear here." {...field} rows={8} />
                          </FormControl>
                           <FormDescription>The AI will mimic the writing style of this article. You can edit it if you want to fine-tune the tone.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading} size="lg">
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Remix Article
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          
          {(isLoading || remixedHtml) && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <CardTitle>Your Remixed Article</CardTitle>
                        <CardDescription>The final article is ready below.</CardDescription>
                    </div>
                     {remixedHtml && (
                        <div className="flex gap-2">
                           <Button variant="outline" size="sm" onClick={handleCopyText} disabled={isTextCopied}>
                                {isTextCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                Copy Text
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleCopy(remixedHtml, 'HTML')} disabled={isHtmlCopied}>
                                {isHtmlCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                Copy HTML
                            </Button>
                        </div>
                     )}
                  </div>
                </CardHeader>
                <CardContent className="min-h-[200px]">
                  {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="mt-4">Remixing your articles...</p>
                    </div>
                  )}
                  {!isLoading && remixedHtml && (
                     <Tabs defaultValue="preview">
                        <TabsList>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                            <TabsTrigger value="html">HTML</TabsTrigger>
                        </TabsList>
                        <TabsContent value="preview" className="border rounded-md p-6 mt-2">
                            <div
                                className="prose dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: remixedHtml }}
                            />
                        </TabsContent>
                        <TabsContent value="html" className="mt-2">
                            <pre className="p-4 bg-secondary rounded-md overflow-x-auto text-sm">
                                <code>{remixedHtml}</code>
                            </pre>
                        </TabsContent>
                    </Tabs>
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

