// src/app/voiceover/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateVoiceover, GenerateVoiceoverInput, GenerateVoiceoverOutput } from '@/ai/flows/generate-voiceover';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, Download, Sparkles, Volume2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  text: z.string().min(10, 'Please enter at least 10 characters to generate audio.'),
  voice: z.string().optional(),
});

// A selection of voices available in the Gemini TTS model
const voices = [
    { name: 'Algenib', description: 'Male, Calm' },
    { name: 'Achernar', description: 'Male, Calm' },
    { name: 'Umbriel', description: 'Male, Calm' },
    { name: 'Leda', description: 'Female, Calm' },
    { name: 'Erinome', description: 'Female, Calm' },
    { name: 'Schedar', description: 'Male, Calm' },
];

export default function VoiceoverGeneratorPage() {
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      voice: 'Algenib',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedAudio(null);
    try {
      const input: GenerateVoiceoverInput = { text: values.text, voice: values.voice };
      const result: GenerateVoiceoverOutput = await generateVoiceover(input);
      setGeneratedAudio(result.audioDataUri);
    } catch (error) {
      console.error('Error generating voiceover:', error);
      toast({
        title: "Error Generating Voiceover",
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
                  <Mic className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-3xl">AI Voiceover Generator</CardTitle>
                    <CardDescription>Convert your text into natural-sounding speech with a variety of voices.</CardDescription>
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
                          <FormLabel>Voice Selection</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a voice" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {voices.map(v => <SelectItem key={v.name} value={v.name}>{v.name} ({v.description})</SelectItem>)}
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
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      {isLoading ? 'Generating Audio...' : 'Generate Voiceover'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Generated Audio</CardTitle>
                <CardDescription>Your voiceover will appear below. You can play or download it.</CardDescription>
              </CardHeader>
              <CardContent className="min-h-[150px] flex flex-col items-center justify-center bg-secondary rounded-md p-6">
                {isLoading && (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p>Generating your audio...</p>
                  </div>
                )}
                {!isLoading && generatedAudio && (
                    <div className="w-full flex flex-col gap-4">
                        <audio src={generatedAudio} controls className="w-full" />
                        <a
                          href={generatedAudio}
                          download={`writebot-ai-voiceover-${Date.now()}.wav`}
                        >
                           <Button className='w-full'>
                             <Download className="mr-2 h-4 w-4" />
                             Download WAV
                           </Button>
                        </a>
                    </div>
                )}
                {!isLoading && !generatedAudio && (
                  <div className="text-center text-muted-foreground">
                    <Volume2 className="h-16 w-16 mx-auto mb-2" />
                    <p>Your audio will be available here.</p>
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
