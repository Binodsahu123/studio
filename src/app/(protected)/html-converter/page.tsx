// src/app/html-converter/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { convertTextToHtml, ConvertTextToHtmlInput, ConvertTextToHtmlOutput } from '@/ai/flows/convert-text-to-html';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, FileCode, Copy, Check, Sparkles, Wand2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  text: z.string().min(20, 'Please enter at least 20 characters to convert.'),
});

export default function HtmlConverterPage() {
  const [convertedHtml, setConvertedHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setConvertedHtml(null);
    try {
      const input: ConvertTextToHtmlInput = values;
      const result: ConvertTextToHtmlOutput = await convertTextToHtml(input);
      setConvertedHtml(result.htmlContent);
    } catch (error) {
      console.error('Error converting to HTML:', error);
      toast({
        title: "Error Converting to HTML",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = () => {
    if (!convertedHtml) return;
    navigator.clipboard.writeText(convertedHtml).then(() => {
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
                  <FileCode className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-3xl">Text to HTML Converter</CardTitle>
                    <CardDescription>Paste your plain text and convert it into SEO-friendly HTML for your blog.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Plain Text</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Paste your article content here..." {...field} rows={12} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading} size="lg">
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Convert to HTML
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          {(isLoading || convertedHtml) && (
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Converted HTML</CardTitle>
                        <CardDescription>Your SEO-friendly HTML is ready.</CardDescription>
                    </div>
                     {convertedHtml && (
                        <Button variant="outline" size="sm" onClick={handleCopy} disabled={isCopied}>
                            {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                            Copy HTML
                        </Button>
                     )}
                  </div>
                </CardHeader>
                <CardContent className="min-h-[200px]">
                  {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="mt-4">Converting your text...</p>
                    </div>
                  )}
                  {!isLoading && convertedHtml && (
                     <Tabs defaultValue="preview">
                        <TabsList>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                            <TabsTrigger value="html">HTML</TabsTrigger>
                        </TabsList>
                        <TabsContent value="preview" className="border rounded-md p-6 mt-2">
                            <div
                                className="prose dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: convertedHtml }}
                            />
                        </TabsContent>
                        <TabsContent value="html" className="mt-2">
                            <pre className="p-4 bg-secondary rounded-md overflow-x-auto text-sm">
                                <code>{convertedHtml}</code>
                            </pre>
                        </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
           <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Why Use This Tool?</CardTitle>
                  <CardDescription>Understand the benefits of structured HTML for your content.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-4">
                    <Sparkles className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Boost Your SEO</h4>
                      <p>Search engines like Google prefer well-structured content. By using proper HTML tags like `<h2>` for headings and `<strong>` for important keywords, you make it easier for search bots to understand your content, which can improve your rankings.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Wand2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Save Time & Effort</h4>
                      <p>Manually adding HTML tags to your articles is tedious and prone to errors. This tool automates the entire process, allowing you to focus on what matters: writing great content.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>A simple process to get clean HTML.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                   <ol className="list-decimal pl-6 space-y-3">
                    <li>
                      <strong>Paste Your Text:</strong> Simply copy your plain text from any editor (like Notepad, Google Docs, or Word) and paste it into the "Your Plain Text" box.
                    </li>
                    <li>
                      <strong>Convert:</strong> Click the "Convert to HTML" button. Our AI will analyze your text and intelligently add the appropriate HTML tags.
                    </li>
                    <li>
                      <strong>Preview & Copy:</strong> You can preview how your content will look on a website. Once you're happy, switch to the "HTML" tab and copy the clean code to paste directly into your website's CMS (like WordPress or Blogger).
                    </li>
                  </ol>
                </CardContent>
              </Card>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
