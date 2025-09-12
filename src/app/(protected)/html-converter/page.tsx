// src/app/(protected)/html-converter/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { convertTextToHtml, ConvertTextToHtmlInput } from '@/ai/flows/convert-text-to-html';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, FileCode, Wand2, Copy, Check, Info } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  plainText: z.string().min(50, 'Please enter at least 50 characters to convert.'),
});

export default function HtmlConverterPage() {
  const [convertedHtml, setConvertedHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plainText: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setConvertedHtml(null);
    try {
      const input: ConvertTextToHtmlInput = values;
      const result = await convertTextToHtml(input);
      setConvertedHtml(result.htmlContent);
    } catch (error) {
      console.error('Error converting to HTML:', error);
      toast({
        title: "Error Converting Text",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="max-w-4xl mx-auto space-y-8">
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
                      name="plainText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Plain Text</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Paste your article content here..." {...field} rows={15} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading} size="lg">
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                      Convert to HTML
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {(isLoading || convertedHtml) && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Converted HTML</CardTitle>
                    {convertedHtml && (
                        <Button variant="outline" size="sm" onClick={handleCopy} disabled={isCopied}>
                            {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                            Copy HTML
                        </Button>
                    )}
                  </div>
                   <CardDescription>The AI-generated HTML is ready below. You can preview it or copy the code.</CardDescription>
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
                            <TabsTrigger value="html">HTML Code</TabsTrigger>
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
            )}
            
            <Card className="bg-secondary/50">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Info className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle>Why Use This Tool?</CardTitle>
                            <CardDescription>Understand the benefits of structured HTML.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>Manually formatting text into HTML is time-consuming and error-prone. This tool automates the process, giving you clean, SEO-friendly code in seconds.</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>SEO Benefits:</strong> Search engines like Google prefer well-structured content. Using proper tags like `<h2>`, `<h3>`, and `<p>` helps them understand your content's hierarchy, which can improve your rankings.</li>
                        <li><strong>Time-Saving:</strong> Instead of manually adding tags, you can focus on writing great content. Let the AI handle the tedious formatting work.</li>
                        <li><strong>Consistency:</strong> Ensures your entire website follows a consistent HTML structure, improving readability and user experience.</li>
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                    <CardDescription>A simple 3-step process.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
                        <p>Paste your plain text into the text area above.</p>
                    </div>
                     <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
                        <p>Click the "Convert to HTML" button and let the AI analyze and structure your content.</p>
                    </div>
                     <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
                        <p>Preview the result and copy the clean HTML code for use in your website or CMS.</p>
                    </div>
                </CardContent>
            </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
}
