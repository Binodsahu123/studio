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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  text: z.string().min(10, 'Please enter at least 10 characters.'),
  voice: z.string().min(1, 'Please select a voice.'),
});

const voices = [
    {
      group: 'English (US) - Female',
      options: [
        { value: 'autonoe', label: 'Autonoe' },
        { value: 'callirrhoe', label: 'Callirrhoe' },
        { value: 'erinome', label: 'Erinome' },
        { value: 'laomedeia', label: 'Laomedeia' },
        { value: 'leda', label: 'Leda' },
      ],
    },
    {
      group: 'English (US) - Male',
      options: [
        { value: 'algenib', label: 'Algenib' },
        { value: 'algieba', label: 'Algieba' },
        { value: 'gacrux', label: 'Gacrux' },
        { value: 'schedar', label: 'Schedar' },
        { value: 'zubenelgenubi', label: 'Zubenelgenubi' },
      ],
    },
    {
      group: 'Hindi (India) - Female',
      options: [
        { value: 'hi-in-Standard-A', label: 'Hindi Female 1' },
        { value: 'hi-in-Wavenet-A', label: 'Hindi Female 2 (Natural)' },
        { value: 'hi-in-Standard-D', label: 'Hindi Female 3' },
        { value: 'hi-in-Wavenet-D', label: 'Hindi Female 4 (Natural)' },
      ],
    },
    {
      group: 'Hindi (India) - Male',
      options: [
        { value: 'hi-in-Standard-B', label: 'Hindi Male 1' },
        { value: 'hi-in-Wavenet-B', label: 'Hindi Male 2 (Natural)' },
        { value: 'hi-in-Standard-C', label: 'Hindi Male 3' },
        { value: 'hi-in-Wavenet-C', label: 'Hindi Male 4 (Natural)' },
      ],
    },
];

export default function VoiceoverGeneratorPage() {
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      voice: 'hi-in-Wavenet-A',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedAudio(null);
    try {
      const input: GenerateVoiceoverInput = values;
      const result: GenerateVoiceoverOutput = await generateVoiceover(input);
      setGeneratedAudio(result.audioDataUri);
    } catch (error) {
      console.error('Error generating voiceover:', error);
      toast({
        title: "Error Generating Voiceover",
        description: "An unexpected error occurred. This can happen if the model is temporarily overloaded. Please try again in a moment.",
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
                    <CardTitle className="text-3xl">High-Quality AI Voiceover</CardTitle>
                    <CardDescription>Convert text into natural-sounding speech using powerful AI models.</CardDescription>
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
                                    {voices.map(group => (
                                        <SelectGroup key={group.group}>
                                            <SelectLabel>{group.group}</SelectLabel>
                                            {group.options.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
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
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      {isLoading ? 'Generating...' : 'Generate Voiceover'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Generated Audio</CardTitle>
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
                  <div className="w-full space-y-4">
                    <audio src={generatedAudio} controls className="w-full">
                        Your browser does not support the audio element.
                    </audio>
                    <a
                      href={generatedAudio}
                      download={`writebot-ai-voiceover-${Date.now()}.wav`}
                    >
                       <Button className="w-full">
                         <Download className="mr-2 h-4 w-4" />
                         Download WAV File
                       </Button>
                    </a>
                  </div>
                )}
                {!isLoading && !generatedAudio && (
                  <div className="text-center text-muted-foreground">
                    <Mic className="h-16 w-16 mx-auto mb-2" />
                    <p>Your generated audio will be available here.</p>
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
