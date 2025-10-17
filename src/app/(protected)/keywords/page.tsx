// src/app/(protected)/keywords/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateKeywordIdeas, GenerateKeywordIdeasInput, GenerateKeywordIdeasOutput } from '@/ai/flows/generate-keyword-ideas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Copy } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const formSchema = z.object({
  topic: z.string().min(3, 'Please enter a topic with at least 3 characters.'),
});

type KeywordIdea = GenerateKeywordIdeasOutput['keywords'][0];

const categories = [
  'Technology', 'Health', 'Finance', 'Marketing', 'Education', 'Travel', 
  'Food', 'Gaming', 'Real Estate', 'Fashion', 'Fitness', 'Automotive'
];

export default function KeywordIdeasPage() {
  const [results, setResults] = useState<KeywordIdea[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  const handleGenerate = async (topic: string) => {
    setIsLoading(true);
    setResults(null);
    setCurrentTopic(topic);
    try {
      const input: GenerateKeywordIdeasInput = { topic };
      const result = await generateKeywordIdeas(input);
      setResults(result.keywords);
    } catch (error) {
      console.error('Error generating keyword ideas:', error);
      toast({
        title: "Error Generating Ideas",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onFormSubmit = (values: z.infer<typeof formSchema>) => {
    handleGenerate(values.topic);
  };
  
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `Copied "${text}"` });
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
                <Search className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle className="text-3xl">Keyword Ideas Generator</CardTitle>
                    <CardDescription>Discover new keywords and analyze their competition and search volume.</CardDescription>
                </div>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Enter a Topic</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 'sustainable fashion' or 'home workout routines'" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Get Keyword Ideas
                    </Button>
                </form>
                </Form>
            </CardContent>
            </Card>

            <Card>
               <CardHeader>
                <CardTitle className="text-xl">Explore by Category</CardTitle>
                <CardDescription>Get popular keyword ideas for different categories.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                        <Button key={category} onClick={() => handleGenerate(category)} disabled={isLoading} variant="outline" size="sm">
                            {isLoading && currentTopic === category ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {category}
                        </Button>
                    ))}
                  </div>
              </CardContent>
            </Card>
          
            {(isLoading || results) && (
              <Card>
                  <CardHeader>
                      <CardTitle>Keyword Analysis for "{currentTopic}"</CardTitle>
                      <CardDescription>Here are the AI-suggested keywords and their analysis.</CardDescription>
                  </CardHeader>
                  <CardContent className="min-h-[200px]">
                      {isLoading && (
                          <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                              <Loader2 className="h-12 w-12 animate-spin text-primary" />
                              <p className="mt-4">Analyzing keywords...</p>
                          </div>
                      )}
                      {!isLoading && results && results.length > 0 && (
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                  <TableHead className="w-[45%]">Keyword</TableHead>
                                  <TableHead className="text-center">Competition</TableHead>
                                  <TableHead className="text-center">Search Volume</TableHead>
                                  <TableHead className="text-right">Action</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {results.map((item) => (
                                  <TableRow key={item.keyword}>
                                      <TableCell className="font-medium">{item.keyword}</TableCell>
                                      <TableCell className="text-center">
                                          <Badge variant={getBadgeVariant(item.difficulty)}>{item.difficulty} ({item.difficultyScore})</Badge>
                                      </TableCell>
                                      <TableCell className="text-center">
                                          <Badge variant={getBadgeVariant(item.searchVolume)}>{item.searchVolume} ({item.searchVolumeScore})</Badge>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleCopy(item.keyword)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                      </TableCell>
                                  </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      )}
                      {!isLoading && results?.length === 0 && (
                          <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                              <p>No keyword ideas were generated. Please try a different topic.</p>
                          </div>
                      )}
                  </CardContent>
              </Card>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
