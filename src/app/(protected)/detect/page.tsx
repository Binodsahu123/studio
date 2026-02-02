// src/app/detect/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeContentOriginality, AnalyzeContentOriginalityInput, AnalyzeContentOriginalityOutput } from '@/ai/flows/analyze-content-originality';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ShieldCheck, HelpCircle } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  text: z.string().min(50, 'Please enter at least 50 characters to analyze.'),
});

// Function to parse the highlighted text and render it as JSX
const renderHighlightedText = (text: string) => {
  const parts = text.split(/<\/?ai-detected>/g);
  return (
      <p className="p-4 bg-secondary rounded-md text-sm leading-relaxed">
          {parts.map((part, index) => {
              // Parts at odd indices are wrapped in the tag
              if (index % 2 === 1) {
                  return (
                      <span key={index} className="bg-blue-200 dark:bg-blue-900/50 p-1 rounded-md">
                          {part}
                      </span>
                  );
              }
              return part;
          })}
      </p>
  );
};


export default function DetectPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeContentOriginalityOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const input: AnalyzeContentOriginalityInput = values;
      const result: AnalyzeContentOriginalityOutput = await analyzeContentOriginality(input);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing content:', error);
      toast({
        title: "Error Analyzing Content",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getProgressColor = (score: number) => {
    if (score > 70) return 'bg-red-500';
    if (score > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className='md:col-span-2'>
                 <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle className="text-3xl">AI & Originality Content Detector</CardTitle>
                            <CardDescription>Paste your text below to check for AI-generated content and originality.</CardDescription>
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
                                <FormLabel>Your Text</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter the content you want to analyze here..." {...field} rows={15} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button type="submit" disabled={isLoading} size="lg">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Analyze Content
                            </Button>
                        </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
            
            <div className='md:col-span-2'>
                {isLoading && (
                    <Card>
                    <CardHeader>
                        <CardTitle>Analyzing...</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center py-12">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </CardContent>
                    </Card>
                )}

                {analysisResult && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Analysis Result</CardTitle>
                            <CardDescription>Here's the breakdown of your content's originality.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">AI Detection Score</h3>
                                <p className="text-sm text-muted-foreground mb-3">This score represents the likelihood of the text being AI-generated. A higher score means a higher probability.</p>
                                <div className="flex items-center gap-4">
                                    <Progress value={analysisResult.aiScore} className="w-full [&>div]:bg-primary" />
                                    <span className="text-2xl font-bold text-primary">{analysisResult.aiScore}%</span>
                                </div>
                            </div>
                             {analysisResult.highlightedText && (
                              <div>
                                <h3 className="text-lg font-semibold mb-2">Highlighted Text Analysis</h3>
                                <p className="text-sm text-muted-foreground mb-3">Parts of the text suspected to be AI-generated are highlighted in blue.</p>
                                {renderHighlightedText(analysisResult.highlightedText)}
                              </div>
                            )}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                                <p className="p-4 bg-secondary rounded-md text-sm">{analysisResult.analysis}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Originality Warning</h3>
                                 <p className="p-4 bg-secondary rounded-md text-sm">{analysisResult.plagiarismWarning}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
             <div className='md:col-span-2'>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-8 w-8 text-primary" />
                      <div>
                        <CardTitle>How to Use the Detector</CardTitle>
                        <CardDescription>Understand the results to ensure your content is authentic.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground">
                      <p>
                        This tool helps you gauge the authenticity of your content by analyzing it for patterns commonly found in AI-generated text.
                      </p>
                      <ul className="list-disc pl-6 space-y-3">
                        <li>
                          <strong>AI Detection Score:</strong> This is an estimated probability. A low score (e.g., 0-40) suggests the text is likely human-written. A high score (e.g., 70-100) suggests a high probability of AI generation. Scores in the middle can be ambiguous.
                        </li>
                        <li>
                          <strong>Highlighted Text:</strong> Our AI highlights sentences and phrases that match common AI writing patterns. This helps you identify specific areas to rewrite for a more human touch.
                        </li>
                        <li>
                          <strong>Originality Warning:</strong> This is NOT a formal plagiarism check. It simply flags if the text seems overly generic or uses common phrases, which might indicate a lack of originality or potential duplicate content. Always use a dedicated plagiarism checker for academic or professional work.
                        </li>
                        <li>
                          <strong>For Best Results:</strong> Analyze texts of at least 50 words. The AI looks for patterns, and very short texts may not provide enough data for an accurate analysis.
                        </li>
                      </ul>
                  </CardContent>
                </Card>
             </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
