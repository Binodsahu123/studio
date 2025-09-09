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
import { Loader2, Mic, Play, Square, Volume2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  text: z.string().min(1, 'Please enter some text.'),
  voice: z.string().min(1, 'Please select a voice.'),
});

export default function VoiceoverGeneratorPage() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const populateVoiceList = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const availableVoices = window.speechSynthesis.getVoices();
    const filteredVoices = availableVoices.filter(
      (voice) => voice.lang.startsWith('en') || voice.lang.startsWith('hi')
    );
    setVoices(filteredVoices);
  }, []);

  useEffect(() => {
    // speechSynthesis.getVoices() is often asynchronous.
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        populateVoiceList();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = populateVoiceList;
        }
    }
  }, [populateVoiceList]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      voice: '',
    },
  });

  const handleSpeech = (values: z.infer<typeof formSchema>) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      toast({
        title: "Speech Synthesis not supported",
        description: "Your browser does not support this feature.",
        variant: "destructive",
      });
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(values.text);
    const selectedVoice = voices.find(v => v.name === values.voice);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
        toast({ title: "Voice not found", variant: "destructive" });
        return;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
        setIsSpeaking(false);
        toast({ title: "An error occurred", description: event.error, variant: "destructive" });
    };

    window.speechSynthesis.speak(utterance);
  };
  
  useEffect(() => {
    // Set a default voice once voices are loaded
    if (voices.length > 0 && !form.getValues('voice')) {
        const hindiFemale = voices.find(v => v.lang === 'hi-IN' && v.name.includes('Google हिन्दी'));
        const englishMale = voices.find(v => v.lang === 'en-US' && v.name.includes('Google US English'));
        form.setValue('voice', hindiFemale?.name || englishMale?.name || voices[0].name);
    }
  }, [voices, form]);


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
                    <CardTitle className="text-3xl">Browser Text-to-Speech</CardTitle>
                    <CardDescription>Convert text into speech using your browser's built-in engine. No API key needed.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSpeech)} className="space-y-6">
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
                           <Select onValueChange={field.onChange} value={field.value} disabled={voices.length === 0}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={voices.length > 0 ? "Select a voice" : "Loading voices..."} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {voices.map(v => (
                                    <SelectItem key={v.name} value={v.name}>
                                        {v.name} ({v.lang})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="lg">
                      {isSpeaking ? (
                        <>
                          <Square className="mr-2 h-4 w-4" /> Stop Speaking
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" /> Speak
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
                <CardTitle>Important Note</CardTitle>
                <CardDescription>Understanding the limitations of browser-based TTS.</CardDescription>
              </CardHeader>
              <CardContent className="min-h-[150px] flex flex-col items-center justify-center bg-secondary rounded-md p-6 text-center">
                 <Volume2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                 <p className="text-muted-foreground">
                    The voice quality and available languages depend entirely on your browser and operating system.
                    This feature works offline but may sound more robotic than cloud-based AI voices.
                 </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
