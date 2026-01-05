// src/app/voiceover/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Volume2, Wand2, Mic, Square } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  text: z.string().min(10, 'Please enter at least 10 characters.'),
  voice: z.string().min(1, 'Please select a voice.'),
});

export default function VoiceoverGeneratorPage() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isApiSupported, setIsApiSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { toast } = useToast();

  const populateVoiceList = useCallback(() => {
    if ('speechSynthesis' in window) {
      const newVoices = window.speechSynthesis.getVoices();
      setVoices(newVoices);
    }
  }, []);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsApiSupported(false);
      return;
    }
    
    populateVoiceList();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
    }
  }, [populateVoiceList]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: 'Hello, this is a test of the offline text-to-speech voiceover generation system using the Web Speech API.',
      voice: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isApiSupported || isSpeaking) return;

    const utterance = new SpeechSynthesisUtterance(values.text);
    const selectedVoice = voices.find(v => v.name === values.voice);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance.onerror', event);
      toast({
        title: "Error Speaking Text",
        description: "An unexpected error occurred while trying to speak.",
        variant: "destructive",
      });
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  function handleStop() {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Mic className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-3xl">Offline Voiceover Generator</CardTitle>
                    <CardDescription>Convert text into speech directly in your browser. No API needed.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!isApiSupported ? (
                   <Alert variant="destructive">
                     <AlertDescription>
                       Your browser does not support the Web Speech API. Please try a different browser like Chrome or Firefox.
                     </AlertDescription>
                   </Alert>
                ) : (
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
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={voices.length === 0}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={voices.length > 0 ? "Choose a voice..." : "Loading voices..."} />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {voices.map(voice => (
                                        <SelectItem key={voice.name} value={voice.name}>
                                            {voice.name} ({voice.lang})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-4">
                        <Button type="submit" disabled={isSpeaking || !isApiSupported} size="lg">
                            <Volume2 className="mr-2 h-4 w-4" />
                            {isSpeaking ? 'Speaking...' : 'Speak Text'}
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleStop} disabled={!isSpeaking} size="lg">
                            <Square className="mr-2 h-4 w-4" />
                            Stop Speaking
                        </Button>
                    </div>
                  </form>
                </Form>
                )}
              </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
