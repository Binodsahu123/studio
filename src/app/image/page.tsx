// src/app/image/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateImageFromPrompt, GenerateImageFromPromptInput, GenerateImageFromPromptOutput } from '@/ai/flows/generate-image-from-prompt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Download, Image as ImageIcon } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

const formSchema = z.object({
  promptText: z.string().min(1, 'Please enter a prompt to generate an image.'),
});

export default function ImagePage() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promptText: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedImage(null);
    try {
      const input: GenerateImageFromPromptInput = values;
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

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="md:col-span-1">
                <CardHeader>
                    <div className="flex items-center gap-3">
                    <ImageIcon className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle className="text-3xl">AI Image Generator</CardTitle>
                        <CardDescription>Describe the image you want to create, and our AI will bring it to life.</CardDescription>
                    </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="promptText"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Your Image Prompt</FormLabel>
                            <FormControl>
                                <Textarea placeholder="e.g., 'A futuristic city skyline at sunset, with flying cars and neon lights, cinematic style'" {...field} rows={5} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={isLoading} size="lg">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Image
                        </Button>
                    </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="md:col-span-1 flex flex-col items-center justify-center">
                <CardContent className="w-full p-6">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        <p className="text-muted-foreground">Generating your image... this may take a moment.</p>
                    </div>
                )}

                {!isLoading && !generatedImage && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                        <ImageIcon className="h-16 w-16 mb-4" />
                        <p>Your generated image will appear here.</p>
                    </div>
                )}

                {generatedImage && (
                    <div className="space-y-4">
                    <div className="relative aspect-square w-full">
                         <Image
                            src={generatedImage}
                            alt="Generated AI Image"
                            fill
                            className="rounded-lg object-contain border"
                        />
                    </div>
                    <Button onClick={handleDownload} className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download Image
                    </Button>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
