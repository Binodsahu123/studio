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
import { Loader2, Copy, Check, ThumbsUp, Sparkles, HelpCircle, ChevronsUpDown } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


const formSchema = z.object({
  title: z.string().min(10, 'Please enter a title of at least 10 characters.'),
  description: z.string().optional(),
  keywords: z.string().optional(),
  language: z.string().min(1, 'Please select a language.'),
});

export default function WritePage() {
  const [generatedOutput, setGeneratedOutput] = useState<GenerateWrittenContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHtmlCopied, setIsHtmlCopied] = useState(false);
  const [isContentCopied, setIsContentCopied] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      keywords: '',
      language: 'Hindi',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedOutput(null);
    setSelectedTitle(null);
    try {
      const input: GenerateWrittenContentInput = values;
      const result: GenerateWrittenContentOutput = await generateWrittenContent(input);
      setGeneratedOutput(result);
      if (result.titles && result.titles.length > 0) {
        setSelectedTitle(result.titles[0]);
      }
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
  
  const handleCopy = (text: string, type: 'HTML' | 'Content' | 'Meta') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'HTML') setIsHtmlCopied(true);
      if (type === 'Content') setIsContentCopied(true);
      
      toast({
        title: "Copied to clipboard!",
        description: `The ${type} has been copied.`,
      });
      
      if (type === 'HTML') setTimeout(() => setIsHtmlCopied(false), 2000);
      if (type === 'Content') setTimeout(() => setIsContentCopied(false), 2000);
    });
  };
  
  const handleCopyContent = () => {
    if (!generatedOutput) return;
    const finalContent = `<h1>${selectedTitle}</h1>\n${generatedOutput.content}`;
    const el = document.createElement('div');
    el.innerHTML = finalContent;
    const plainText = el.textContent || el.innerText || "";
    handleCopy(plainText, 'Content');
  };
  
  const handleSelectTitle = (title: string) => {
    setSelectedTitle(title);
  }
  
  const finalHtmlContent = generatedOutput && selectedTitle 
    ? `<h1>${selectedTitle}</h1>\n${generatedOutput.content}`
    : generatedOutput?.content || '';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-3xl">AI Content Writer</CardTitle>
                <CardDescription>Fill out the form below to generate high-quality, SEO-optimized content.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'A Complete Guide to Digital Marketing in 2024'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Briefly describe what the article is about..." {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords / Tags (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., seo, content marketing, smb" {...field} />
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
                <Button type="submit" disabled={isLoading} size="lg">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Content
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="max-w-4xl mx-auto mt-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <HelpCircle className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>How to Use the Content Writer</CardTitle>
                <CardDescription>Follow these tips to get the best possible results.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
              <p>
                To get the best results from our AI Content Writer, simply provide a clear and specific title. The more detailed your title, the better the article will be.
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>Main Title:</strong> This is the most important input. A good title helps the AI understand the topic, angle, and target audience.
                </li>
                <li>
                  <strong>Short Description (Optional):</strong> Provide a sentence or two of context to guide the AI on the article's goal or tone.
                </li>
                <li>
                  <strong>Keywords (Optional):</strong> List comma-separated keywords you want the AI to focus on.
                </li>
              </ul>
              <p>
                The AI will generate a complete article, 10 SEO-friendly titles, a meta description, relevant tags, and even titles for images to use in your post.
              </p>
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
              <CardTitle>Generated Assets</CardTitle>
              <CardDescription>Review and use the generated content and SEO assets below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                  <h3 className="text-xl font-semibold mb-3">Title Suggestions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {generatedOutput.titles.map((title, index) => (
                      <Card 
                        key={index}
                        onClick={() => handleSelectTitle(title)}
                        className={`p-4 cursor-pointer transition-all ${selectedTitle === title ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-secondary'}`}
                      >
                        <div className="flex items-start gap-3">
                           {selectedTitle === title ? <ThumbsUp className="h-5 w-5 text-primary mt-1 flex-shrink-0" /> : <ThumbsUp className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />}
                           <p className="flex-1 font-semibold text-lg">{title}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Meta Description</h3>
                    <div className="p-4 bg-secondary rounded-md relative group h-full">
                      <p className="text-sm">{generatedOutput.description}</p>
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(generatedOutput.description, 'Meta')}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                </div>
                 <div>
                  <h3 className="text-lg font-semibold mb-2">Focus Keywords</h3>
                  <div className="p-4 bg-secondary rounded-md relative group h-full">
                    <p className="text-sm">{generatedOutput.tags}</p>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(generatedOutput.tags, 'Meta')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
               <div>
                  <h3 className="text-lg font-semibold mb-2">Image Titles / Alt Text</h3>
                  <div className="p-4 bg-secondary rounded-md">
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      {generatedOutput.imageTitles.map((title, index) => <li key={index}>{title}</li>)}
                    </ul>
                  </div>
              </div>
              
              <Separator />

              <div>
                <h3 className="text-xl font-semibold mb-4">Generated Content</h3>
                 <Tabs defaultValue="preview">
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-4 flex-wrap gap-4">
                    <TabsList>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="html">HTML</TabsTrigger>
                    </TabsList>
                     <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" onClick={handleCopyContent} disabled={isContentCopied} className="w-full">
                        {isContentCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                        Copy Content
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleCopy(finalHtmlContent, 'HTML')} disabled={isHtmlCopied} className="w-full">
                        {isHtmlCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                        Copy HTML
                      </Button>
                    </div>
                  </div>
                  <TabsContent value="preview" className="border rounded-md p-2 sm:p-6">
                    <div
                      className="prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: finalHtmlContent }}
                    />
                  </TabsContent>
                  <TabsContent value="html">
                    <pre className="p-2 sm:p-4 bg-secondary rounded-md overflow-x-auto text-sm">
                      <code>{finalHtmlContent}</code>
                    </pre>
                  </TabsContent>
                </Tabs>
              </div>

            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
