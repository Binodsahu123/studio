// src/app/voiceover/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, Play, Pause, Square, Volume2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const formSchema = z.object({
  text: z.string().min(10, 'Please enter at least 10 characters.'),
  voice: z.string().min(1, 'Please select a voice.'),
  rate: z.number().min(0.5).max(2),
  pitch: z.number().min(0).max(2),
});

export default function VoiceoverGeneratorPage() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      voice: '',
      rate: 1,
      pitch: 1,
    },
  });

  const loadVoices = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        const availableVoices = window.speechSynthesis.getVoices();
        const filteredVoices = availableVoices.filter(v => v.lang.startsWith('en') || v.lang.startsWith('hi'));
        setVoices(filteredVoices);
        if (filteredVoices.length > 0 && !form.getValues('voice')) {
            // Set a default Hindi or English voice if available
            const defaultVoice = filteredVoices.find(v => v.lang === 'hi-IN') || filteredVoices.find(v => v.lang === 'en-US') || filteredVoices[0];
            form.setValue('voice', defaultVoice.voiceURI);
        }
    }
  };

  useEffect(() => {
    // Load voices when the component mounts and when they change.
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup: cancel any ongoing speech when the component unmounts.
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeech = (values: z.infer<typeof formSchema>) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        toast({ title: "Speech Synthesis not supported in this browser.", variant: "destructive"});
        return;
    }

    if (isSpeaking) {
        window.speechSynthesis.pause();
        setIsSpeaking(false);
        return;
    }
    
    window.speechSynthesis.cancel(); // Clear any previous speech

    const utterance = new SpeechSynthesisUtterance(values.text);
    const selectedVoice = voices.find(v => v.voiceURI === values.voice);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      toast({ title: "Selected voice not found.", description: "Please select another voice.", variant: "destructive"});
      return;
    }

    utterance.pitch = values.pitch;
    utterance.rate = values.rate;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
        setIsSpeaking(false);
        toast({ title: "An error occurred during speech.", variant: "destructive"});
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  const handleStop = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
      }
  }

  const englishVoices = voices.filter(v => v.lang.startsWith('en'));
  const hindiVoices = voices.filter(v => v.lang.startsWith('hi'));

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
                    <CardTitle className="text-3xl">Browser-Based Voiceover</CardTitle>
                    <CardDescription>Convert text to speech using your browser's built-in engine. No API needed.</CardDescription>
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
                            <FormLabel>Select a Voice</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                <SelectTrigger disabled={voices.length === 0}>
                                    <SelectValue placeholder={voices.length > 0 ? "Choose a voice..." : "No voices available"} />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {hindiVoices.length > 0 && (
                                        <SelectGroup>
                                            <SelectLabel>Hindi Voices</SelectLabel>
                                            {hindiVoices.map(voice => (
                                                <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                                                    {`${voice.name} (${voice.lang})`}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    )}
                                     {englishVoices.length > 0 && (
                                        <SelectGroup>
                                            <SelectLabel>English Voices</SelectLabel>
                                            {englishVoices.map(voice => (
                                                <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                                                    {`${voice.name} (${voice.lang})`}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="rate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Speed (Rate): {field.value.toFixed(1)}</FormLabel>
                                <FormControl>
                                    <Slider
                                        min={0.5}
                                        max={2}
                                        step={0.1}
                                        defaultValue={[field.value]}
                                        onValueChange={(values) => field.onChange(values[0])}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="pitch"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pitch (Tone): {field.value.toFixed(1)}</FormLabel>
                                <FormControl>
                                    <Slider
                                        min={0}
                                        max={2}
                                        step={0.1}
                                        defaultValue={[field.value]}
                                        onValueChange={(values) => field.onChange(values[0])}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4">
                        <Button type="submit" size="lg">
                            {isSpeaking ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            {isSpeaking ? 'Pause' : 'Play'}
                        </Button>
                         <Button type="button" variant="outline" size="lg" onClick={handleStop} disabled={!isSpeaking}>
                            <Square className="mr-2 h-4 w-4" />
                            Stop
                        </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
