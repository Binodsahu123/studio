// src/app/voiceover/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateVoiceover, GenerateVoiceoverInput, GenerateVoiceoverOutput } from '@/ai/flows/generate-voiceover';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Volume2, Download, Wand2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  text: z.string().min(10, 'Please enter at least 10 characters.'),
  voice: z.string().min(1, 'Please select a voice.'),
});

// Using only the allowed voice names from the error message.
const voices = [
    { value: 'gacrux', label: 'Hindi (India) - Female 1' },
    { value: 'schedar', label: 'Hindi (India) - Male 1' },
    { value: 'achernar', label: 'English (India) - Female' },
    { value: 'algenib', label: 'English (India) - Male' },
    { value: 'autonoe', label: 'English (US) - Female' },
    { value: 'charon', label: 'English (US) - Male' },
    { value: 'erinome', label: 'English (Australia) - Female' },
    { value: 'iapetus', label: 'English (Australia) - Male' },
    { value: 'despina', label: 'English (UK) - Male 1' },
    { value: 'kore', label: 'English (UK) - Male 2' },
    { value: 'laomedeia', label: 'English (UK) - Female 1' },
    { value: 'leda', label: 'English (UK) - Female 2' },
];


export default function VoiceoverGeneratorPage() {
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: 'Hello, this is a test of the text-to-speech voiceover generation system.',
      voice: 'gacrux',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedAudio(null);
    try {
      const input: GenerateVoiceoverInput = values;
      const result: GenerateVoiceoverOutput = await generateVoiceover(input);
      setGeneratedAudio(result.audioDataUri);
      toast({
        title: "Voiceover Generated!",
        description: "Your audio is ready to be played or downloaded.",
      });
    } catch (error) {
      console.error('Error generating voiceover:', error);
      toast({
        title: "Error Generating Voiceover",
        description: "The AI model might be busy or an error occurred. Please try again.",
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
                  <Volume2 className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-3xl">AI Voiceover Generator</CardTitle>
                    <CardDescription>Convert text into high-quality, natural-sounding speech.</CardDescription>
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
                            <Textarea placeholder="Enter the text you want to convert to speech..." {...field} rows={6} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                        control={form.control}
                        name="voice"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Select a Voice</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a voice..." />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {voices.map(voice => (
                                        <SelectItem key={voice.value} value={voice.value}>
                                            {voice.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading} size="lg">
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                      )}
                      {isLoading ? 'Generating...' : 'Generate Voiceover'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          {(isLoading || generatedAudio) && (
            <div className="md:col-span-2">
                <Card>
                <CardHeader>
                    <CardTitle>Your Audio</CardTitle>
                    <CardDescription>Listen to the generated voiceover below.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[100px] flex items-center justify-center bg-secondary rounded-md">
                    {isLoading && (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p>Generating your audio...</p>
                    </div>
                    )}
                    {!isLoading && generatedAudio && (
                        <div className="w-full space-y-4">
                            <audio controls src={generatedAudio} className="w-full">
                                Your browser does not support the audio element.
                            </audio>
                             <a
                                href={generatedAudio}
                                download={`writebot-ai-voiceover-${Date.now()}.wav`}
                                className="inline-block w-full"
                            >
                                <Button className="w-full" variant="outline">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download WAV File
                                </Button>
                            </a>
                        </div>
                    )}
                </CardContent>
                </Card>
            </div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
