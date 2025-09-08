// src/app/blog/page.tsx
'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, FileText, Lightbulb, Heading2, Image as ImageIcon, Copy, Check, ThumbsUp } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { generateImprovedSeoKeywords, GenerateImprovedSeoKeywordsInput, GenerateImprovedSeoKeywordsOutput } from '@/ai/flows/generate-improved-seo-keywords';
import { generateWrittenContent, GenerateWrittenContentInput } from '@/ai/flows/generate-written-content';
import { generateBlogOutline, GenerateBlogOutlineInput } from '@/ai/flows/generate-blog-outline';
import { generateBlogFromOutline, GenerateBlogFromOutlineInput } from '@/ai/flows/generate-blog-from-outline';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const formSchema = z.object({
  topic: z.string().min(5, 'Please enter a topic with at least 5 characters.'),
  keywords: z.string().optional(),
  selectedKeywords: z.array(z.string()).optional(),
  selectedTitle: z.string().optional(),
  outline: z.string().optional(),
  article: z.string().optional(),
});

type KeywordAnalysis = GenerateImprovedSeoKeywordsOutput['improvedKeywords'][0];

export default function BlogWorkflowPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [keywordResults, setKeywordResults] = useState<KeywordAnalysis[] | null>(null);
  const [titleResults, setTitleResults] = useState<string[] | null>(null);
  const [finalArticle, setFinalArticle] = useState<string>("");
  const [isHtmlCopied, setIsHtmlCopied] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      keywords: '',
      selectedKeywords: [],
      selectedTitle: '',
      outline: '',
      article: '',
    },
  });

  const getStepClass = (step: number) => {
    if (step < currentStep) return 'border-green-500 bg-green-500/10 text-green-700';
    if (step === currentStep) return 'border-primary bg-primary/10';
    return 'border-border bg-card text-muted-foreground';
  };

  const handleGenerateKeywords = async () => {
    setIsLoading(true);
    setKeywordResults(null);
    try {
      const topic = form.getValues('topic');
      const result = await generateImprovedSeoKeywords({ contentTopic: topic, originalKeywords: '' });
      setKeywordResults(result.improvedKeywords);
      form.setValue('keywords', result.improvedKeywords.map(k => k.keyword).join(', '));
    } catch (error) {
      toast({ title: "Error generating keywords", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTitles = async () => {
    setIsLoading(true);
    setTitleResults(null);
    try {
      const { topic, keywords } = form.getValues();
      const result = await generateWrittenContent({ title: topic, shortDescription: `A blog post about ${topic}`, language: 'English', additionalTopic: keywords || '' });
      setTitleResults(result.titles);
      form.setValue('selectedTitle', result.titles[0] || '');
    } catch (error) {
      toast({ title: "Error generating titles", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateOutline = async () => {
    setIsLoading(true);
    try {
        const { selectedTitle, keywords } = form.getValues();
        if (!selectedTitle) {
            toast({ title: "Please select a title first.", variant: "destructive" });
            return;
        }
        const result = await generateBlogOutline({ title: selectedTitle, keywords: keywords || '' });
        form.setValue('outline', result.outline);
    } catch (error) {
        toast({ title: "Error generating outline", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  }

  const handleGenerateArticle = async () => {
      setIsLoading(true);
      setFinalArticle("");
      try {
          const { selectedTitle, outline } = form.getValues();
          if (!selectedTitle || !outline) {
              toast({ title: "Title and outline are required.", variant: "destructive" });
              return;
          }
          const result = await generateBlogFromOutline({ title: selectedTitle, outline });
          setFinalArticle(result.article);
      } catch (error) {
          toast({ title: "Error generating article", variant: "destructive" });
      } finally {
          setIsLoading(false);
      }
  }

  const handleCopyHtml = () => {
    const title = form.getValues('selectedTitle');
    if (!title || !finalArticle) return;
    const fullHtml = `<h1>${title}</h1>\n${finalArticle}`;
    navigator.clipboard.writeText(fullHtml).then(() => {
        setIsHtmlCopied(true);
        toast({ title: "Copied HTML to clipboard!" });
        setTimeout(() => setIsHtmlCopied(false), 2000);
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-3xl">Full Blog Post Workflow</CardTitle>
                  <CardDescription>Follow the steps to generate a complete, SEO-optimized blog post from just a topic.</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="flex items-start my-8 space-x-2 md:space-x-4 overflow-x-auto pb-4">
              {[1,2,3,4,5].map(step => (
                <div key={step} className={`rounded-lg border-2 p-3 text-center min-w-[120px] transition-all ${getStepClass(step)}`}>
                  <p className="text-sm font-semibold">Step {step}</p>
                  <p className="text-xs">{['Topic', 'Keywords', 'Titles', 'Outline', 'Article'][step - 1]}</p>
                </div>
              ))}
          </div>
        
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              
              {/* STEP 1: TOPIC */}
              {currentStep === 1 && (
                  <Card>
                      <CardHeader><CardTitle>Step 1: Start with a Topic</CardTitle></CardHeader>
                      <CardContent>
                           <FormField
                              control={form.control}
                              name="topic"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>What is your blog post about?</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., 'The benefits of remote work for tech companies'" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                      </CardContent>
                      <CardFooter>
                          <Button onClick={() => { if(form.getValues('topic')) setCurrentStep(2)}}>Next: Generate Keywords</Button>
                      </CardFooter>
                  </Card>
              )}

              {/* STEP 2: KEYWORDS */}
              {currentStep === 2 && (
                  <Card>
                      <CardHeader>
                        <CardTitle>Step 2: Generate SEO Keywords</CardTitle>
                        <CardDescription>Based on your topic "{form.getValues('topic')}", here are some keyword suggestions.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <Button onClick={handleGenerateKeywords} disabled={isLoading}>
                              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Generate Keyword Ideas
                          </Button>
                          {keywordResults && (
                            <div className="space-y-2">
                              <FormLabel>Suggested Keywords</FormLabel>
                              <div className="p-4 bg-secondary rounded-md space-y-3">
                                {keywordResults.map(kw => (
                                    <div key={kw.keyword}>
                                        <p className="font-semibold">{kw.keyword}</p>
                                        <div className='flex gap-2'>
                                            <Badge variant={kw.difficulty === 'Low' ? 'secondary' : kw.difficulty === 'Medium' ? 'default' : 'destructive'}>Difficulty: {kw.difficulty}</Badge>
                                            <Badge variant={kw.viralityPotential === 'Low' ? 'secondary' : kw.viralityPotential === 'Medium' ? 'default' : 'destructive'}>Virality: {kw.viralityPotential}</Badge>
                                        </div>
                                    </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </CardContent>
                       <CardFooter className="flex justify-between">
                          <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
                          <Button onClick={() => setCurrentStep(3)} disabled={!keywordResults}>Next: Generate Titles</Button>
                      </CardFooter>
                  </Card>
              )}

              {/* STEP 3: TITLES */}
              {currentStep === 3 && (
                  <Card>
                      <CardHeader>
                        <CardTitle>Step 3: Choose a Winning Title</CardTitle>
                        <CardDescription>Here are some catchy, SEO-friendly titles. Pick one to continue.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                           <Button onClick={handleGenerateTitles} disabled={isLoading}>
                              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Generate Title Ideas
                           </Button>
                          {titleResults && (
                              <FormField
                                control={form.control}
                                name="selectedTitle"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                    <FormLabel>Select the best title:</FormLabel>
                                    <FormControl>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {titleResults.map((title, index) => (
                                            <Card
                                            key={index}
                                            onClick={() => field.onChange(title)}
                                            className={`p-4 cursor-pointer transition-all ${field.value === title ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-secondary'}`}
                                            >
                                            <div className="flex items-start gap-3">
                                                {field.value === title ? <ThumbsUp className="h-5 w-5 text-primary mt-1 flex-shrink-0" /> : <ThumbsUp className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />}
                                                <p className="flex-1">{title}</p>
                                            </div>
                                            </Card>
                                        ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                           )}
                      </CardContent>
                      <CardFooter className="flex justify-between">
                          <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
                          <Button onClick={() => setCurrentStep(4)} disabled={!form.getValues('selectedTitle')}>Next: Generate Outline</Button>
                      </CardFooter>
                  </Card>
              )}
                
              {/* STEP 4: OUTLINE */}
              {currentStep === 4 && (
                  <Card>
                      <CardHeader>
                        <CardTitle>Step 4: Create a Blog Outline</CardTitle>
                        <CardDescription>Generate a structure for your article based on the title and keywords.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <Button onClick={handleGenerateOutline} disabled={isLoading}>
                              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Generate Outline
                          </Button>
                           <FormField
                                control={form.control}
                                name="outline"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Generated Outline</FormLabel>
                                    <FormControl>
                                         <div className="border rounded-md p-4 bg-secondary">
                                            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: field.value || "" }} />
                                         </div>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                      </CardContent>
                      <CardFooter className="flex justify-between">
                          <Button variant="outline" onClick={() => setCurrentStep(3)}>Back</Button>
                          <Button onClick={() => setCurrentStep(5)} disabled={!form.getValues('outline')}>Next: Generate Full Article</Button>
                      </CardFooter>
                  </Card>
              )}

              {/* STEP 5: ARTICLE */}
              {currentStep === 5 && (
                  <Card>
                      <CardHeader>
                        <CardTitle>Step 5: Generate the Full Article</CardTitle>
                        <CardDescription>Let's write the complete article based on your chosen title and outline.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <Button onClick={handleGenerateArticle} disabled={isLoading}>
                              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Generate Full Article
                          </Button>
                         
                         {finalArticle && (
                              <div className="space-y-4">
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold">Your Final Article</h3>
                                    <Button variant="outline" size="sm" onClick={handleCopyHtml} disabled={isHtmlCopied}>
                                        {isHtmlCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                        Copy HTML
                                    </Button>
                                </div>
                                <Tabs defaultValue="preview">
                                    <TabsList>
                                        <TabsTrigger value="preview">Preview</TabsTrigger>
                                        <TabsTrigger value="html">HTML</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="preview" className="border rounded-md p-6">
                                        <h1 className="text-3xl font-bold mb-4">{form.getValues('selectedTitle')}</h1>
                                        <div
                                            className="prose dark:prose-invert max-w-none"
                                            dangerouslySetInnerHTML={{ __html: finalArticle }}
                                        />
                                    </TabsContent>
                                    <TabsContent value="html">
                                        <pre className="p-4 bg-secondary rounded-md overflow-x-auto text-sm">
                                            <code>{`<h1>${form.getVlues('selectedTitle')}</h1>\n${finalArticle}`}</code>
                                        </pre>
                                    </TabsContent>
                                </Tabs>
                              </div>
                          )}

                      </CardContent>
                       <CardFooter className="flex justify-between">
                          <Button variant="outline" onClick={() => setCurrentStep(4)}>Back</Button>
                      </CardFooter>
                  </Card>
              )}
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
