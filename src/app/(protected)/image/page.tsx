// src/app/image/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateImageFromPrompt, GenerateImageFromPromptInput, GenerateImageFromPromptOutput } from '@/ai/flows/generate-image-from-prompt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ImageIcon, Download, Sparkles } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

const formSchema = z.object({
  prompt: z.string().min(10, 'Please enter a prompt with at least 10 characters.'),
});

export default function ImageGeneratorPage() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedImage(null);
    try {
      const input: GenerateImageFromPromptInput = { promptText: values.prompt };
      const result: GenerateImageFromPromptOutput = await generateImageFromPrompt(input);
      setGeneratedImage(result.imageDataUri);
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error Generating Image",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-3xl">AI Image Generator</CardTitle>
                    <CardDescription>Describe the image you want to create, and let AI bring it to life.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Image Prompt</FormLabel>
                          <FormControl>
                            <Textarea placeholder="e.g., 'A majestic lion with a crown of stars, in a cosmic jungle, digital art'" {...field} rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading} size="lg">
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      {isLoading ? 'Generating...' : 'Generate Image'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Generated Image</CardTitle>
                <CardDescription>Your generated image will appear below.</CardDescription>
              </CardHeader>
              <CardContent className="min-h-[300px] flex items-center justify-center bg-secondary rounded-md">
                {isLoading && (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p>Generating your masterpiece...</p>
                  </div>
                )}
                {!isLoading && generatedImage && (
                  <div className="relative group w-full max-w-[512px]">
                    <Image
                      src={generatedImage}
                      alt={form.getValues('prompt')}
                      width={512}
                      height={512}
                      className="rounded-lg shadow-lg"
                      unoptimized // Since it's a data URI
                    />
                    <a
                      href={generatedImage}
                      download={`writebot-ai-image-${Date.now()}.png`}
                      className="absolute bottom-4 right-4"
                    >
                       <Button>
                         <Download className="mr-2 h-4 w-4" />
                         Download
                       </Button>
                    </a>
                  </div>
                )}
                {!isLoading && !generatedImage && (
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="h-16 w-16 mx-auto mb-2" />
                    <p>Your image will be displayed here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
