// src/app/seo/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateImprovedSeoKeywords, GenerateImprovedSeoKeywordsInput, GenerateImprovedSeoKeywordsOutput } from '@/ai/flows/generate-improved-seo-keywords';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, TrendingUp, CheckCircle, Flame, BarChart } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const formSchema = z.object({
  originalKeywords: z.string().optional(),
  contentTopic: z.string().min(5, 'Please enter a topic with at least 5 characters.'),
});

type KeywordAnalysis = GenerateImprovedSeoKeywordsOutput['improvedKeywords'][0];

export default function SeoPage() {
  const [analysisResult, setAnalysisResult] = useState<GenerateImprovedSeoKeywordsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originalKeywords: '',
      contentTopic: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const input: GenerateImprovedSeoKeywordsInput = {
        contentTopic: values.contentTopic,
        originalKeywords: values.originalKeywords || '',
      };
      const result = await generateImprovedSeoKeywords(input);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error generating SEO analysis:', error);
      toast({
        title: "Error Generating Analysis",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getBadgeVariant = (level: 'Low' | 'Medium' | 'High'): 'secondary' | 'default' | 'destructive' => {
    switch (level) {
      case 'Low':
        return 'secondary';
      case 'Medium':
        return 'default';
      case 'High':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-3xl">Advanced SEO Keyword Analyzer</CardTitle>
                <CardDescription>Get detailed insights, difficulty analysis, and title suggestions for your keywords.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="contentTopic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Digital marketing for small businesses'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="originalKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Current Keywords (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter your current keywords, separated by commas..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} size="lg">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze Keywords
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
            <Card className="max-w-4xl mx-auto mt-8">
              <CardHeader>
                <CardTitle>Analyzing...</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </CardContent>
            </Card>
        )}

        {analysisResult && analysisResult.improvedKeywords.length > 0 && (
          <Card className="max-w-4xl mx-auto mt-8">
            <CardHeader>
              <CardTitle>Keyword Analysis Report</CardTitle>
              <CardDescription>Here are the AI-suggested keywords and their strategic analysis.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[30%]">Keyword</TableHead>
                        <TableHead className="text-center">Difficulty</TableHead>
                        <TableHead className="text-center">Virality Potential</TableHead>
                        <TableHead className="text-right">Title Ideas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {analysisResult.improvedKeywords.map((item: KeywordAnalysis) => (
                        <TableRow key={item.keyword}>
                            <TableCell className="font-medium">{item.keyword}</TableCell>
                            <TableCell className="text-center">
                                <Badge variant={getBadgeVariant(item.difficulty)}>{item.difficulty}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge variant={getBadgeVariant(item.viralityPotential)}>{item.viralityPotential}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Collapsible>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="sm">View</Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <Card className="mt-2 p-3 text-left">
                                            <ul className="space-y-2 list-disc list-inside">
                                                {item.suggestedTitles.map((title, index) => <li key={index}>{title}</li>)}
                                            </ul>
                                        </Card>
                                    </CollapsibleContent>
                                </Collapsible>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
