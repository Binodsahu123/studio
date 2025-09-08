// src/app/write/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateWrittenContent, GenerateWrittenContentInput, GenerateWrittenContentOutput } from '@/ai/flows/generate-written-content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Copy, Check } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  title: z.string().min(1, 'Please enter a title.'),
  shortDescription: z.string().min(1, 'Please enter a short description.'),
  language: z.string().min(1, 'Please select a language.'),
  additionalTopic: z.string().min(1, 'Please enter an additional topic.'),
});

export default function WritePage() {
  const [generatedOutput, setGeneratedOutput] = useState<GenerateWrittenContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHtmlCopied, setIsHtmlCopied] = useState(false);
  const [isContentCopied, setIsContentCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      shortDescription: '',
      language: 'English',
      additionalTopic: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedOutput(null);
    try {
      const input: GenerateWrittenContentInput = values;
      const result: GenerateWrittenContentOutput = await generateWrittenContent(input);
      setGeneratedOutput(result);
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error Generating Content",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleCopyHtml = () => {
    if (!generatedOutput) return;
    navigator.clipboard.writeText(generatedOutput.content).then(() => {
      setIsHtmlCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "The HTML content has been copied.",
      });
      setTimeout(() => setIsHtmlCopied(false), 2000);
    });
  };
  
  const handleCopyContent = () => {
    if (!generatedOutput) return;
    const el = document.createElement('div');
    el.innerHTML = generatedOutput.content;
    const plainText = el.textContent || el.innerText || "";
    navigator.clipboard.writeText(plainText).then(() => {
      setIsContentCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "The content text has been copied.",
      });
      setTimeout(() => setIsContentCopied(false), 2000);
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Generate Written Content</CardTitle>
            <CardDescription>Fill out the form below to generate high-quality content with AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'The Future of Artificial Intelligence'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Briefly describe what the content is about." {...field} />
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
                      <FormLabel>Language</FormLabel>
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
                <FormField
                  control={form.control}
                  name="additionalTopic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Topic/Keyword</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Machine Learning'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Content
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
            <Card className="max-w-4xl mx-auto mt-8">
              <CardHeader>
                <CardTitle>Generating...</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </CardContent>
            </Card>
        )}

        {generatedOutput && (
          <Card className="max-w-4xl mx-auto mt-8">
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Title</h3>
                  <p className="p-4 bg-secondary rounded-md">{generatedOutput.title}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="p-4 bg-secondary rounded-md">{generatedOutput.description}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {generatedOutput.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </div>
              </div>
              <Tabs defaultValue="preview">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="html">HTML</TabsTrigger>
                  </TabsList>
                   <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyContent} disabled={isContentCopied}>
                      {isContentCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      Copy Content
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopyHtml} disabled={isHtmlCopied}>
                      {isHtmlCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      Copy HTML
                    </Button>
                  </div>
                </div>
                <TabsContent value="preview" className="border rounded-md p-6">
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: generatedOutput.content }}
                  />
                </TabsContent>
                <TabsContent value="html">
                  <pre className="p-4 bg-secondary rounded-md overflow-x-auto text-sm">
                    <code>{generatedOutput.content}</code>
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
