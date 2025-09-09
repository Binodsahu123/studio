// src/app/voiceover/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, Play, Download, Volume2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateVoiceover, GenerateVoiceoverInput, GenerateVoiceoverOutput } from '@/ai/flows/generate-voiceover';

const formSchema = z.object({
  text: z.string().min(10, 'Please enter at least 10 characters.'),
  voice: z.string().min(1, 'Please select a voice.'),
});

// High-quality voices available from the Google AI API
const voices = [
    { name: 'Algenib', description: 'English (US), Male' },
    { name: 'Achernar', description: 'English (US), Female' },
    { name: 'Umbriel', description: 'English (UK), Male' },
    { name: 'Rasalgethi', description: 'English (UK), Female' },
    { name: 'Sadalmelik', description: 'English (India), Female' },
    { name: 'Male-IN-1', description: 'Hindi (India), Male' },
    { name: 'Female-IN-1', description: 'Hindi (India), Female' },
    { name: 'Female-IN-2', description: 'Hindi (India), Female 2' },
];


export default function VoiceoverGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      voice: 'Female-IN-1', // Default to a high-quality Hindi voice
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAudioDataUri(null);
    try {
      const input: GenerateVoiceoverInput = values;
      const result: GenerateVoiceoverOutput = await generateVoiceover(input);
      setAudioDataUri(result.audioDataUri);
      toast({
        title: "Voiceover Generated!",
        description: "Your audio is ready to be played or downloaded.",
      });
    } catch (error) {
      console.error('Error generating voiceover:', error);
      toast({
        title: "Error Generating Voiceover",
        description: "The AI model might be busy. Please try again in a moment.",
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
                    <CardDescription>Convert text into high-quality, natural-sounding speech using AI.</CardDescription>
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
                           <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a voice" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {voices.map(v => (
                                    <SelectItem key={v.name} value={v.name}>
                                        {v.description}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="lg" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" /> Generate Voiceover
                        </>
                      )}
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
                <CardDescription>Your generated voiceover will appear here.</CardDescription>
              </CardHeader>
              <CardContent className="min-h-[150px] flex flex-col items-center justify-center bg-secondary rounded-md p-6 text-center">
                 {isLoading && <Loader2 className="h-12 w-12 animate-spin text-primary" />}
                 {!isLoading && !audioDataUri && (
                     <>
                        <Volume2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Your audio will be available here once generated.</p>
                     </>
                 )}
                 {audioDataUri && (
                   <div className="w-full space-y-4">
                     <audio controls src={audioDataUri} className="w-full">
                       Your browser does not support the audio element.
                     </audio>
                     <Button asChild>
                       <a href={audioDataUri} download={`writebot-voiceover-${Date.now()}.wav`}>
                         <Download className="mr-2 h-4 w-4" />
                         Download WAV
                       </a>
                     </Button>
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
