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
import { Loader2, Mic, Play, Pause, Volume2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from "@/components/ui/slider";


const formSchema = z.object({
  text: z.string().min(10, 'Please enter at least 10 characters.'),
  voice: z.string().optional(),
  rate: z.number().min(0.5).max(2),
  pitch: z.number().min(0).max(2),
});

interface VoiceOption {
  name: string;
  lang: string;
  voice: SpeechSynthesisVoice;
}

export default function VoiceoverGeneratorPage() {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
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

  useEffect(() => {
    function loadVoices() {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        const filteredVoices = availableVoices
          .filter(v => v.lang.startsWith('en') || v.lang.startsWith('hi'))
          .map(v => ({ name: `${v.name} (${v.lang})`, lang: v.lang, voice: v }));
        
        setVoices(filteredVoices);
        
        // Set a default Hindi voice if available
        const defaultHindiVoice = filteredVoices.find(v => v.lang === 'hi-IN');
        if (defaultHindiVoice) {
            form.setValue('voice', defaultHindiVoice.name);
        } else if (filteredVoices.length > 0) {
            form.setValue('voice', filteredVoices[0].name);
        }
      }
    }

    // Voices may load asynchronously.
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      loadVoices();
      window.speechhSynthesis.onvoiceschanged = loadVoices;
    }

    // Cleanup: cancel any ongoing speech when the component unmounts.
    return () => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    };
  }, [form]);
  
  function handlePlayPause() {
    if (isSpeaking) {
        window.speechSynthesis.pause();
        setIsSpeaking(false);
    } else {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setIsSpeaking(true);
        } else {
            onSubmit(form.getValues());
        }
    }
  }
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!window.speechSynthesis) {
      toast({
        title: "Browser Not Supported",
        description: "Your browser does not support the Web Speech API.",
        variant: "destructive",
      });
      return;
    }
    
    // Cancel any previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(values.text);
    const selectedVoice = voices.find(v => v.name === values.voice);

    if (selectedVoice) {
      utterance.voice = selectedVoice.voice;
    }
    
    utterance.rate = values.rate;
    utterance.pitch = values.pitch;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onpause = () => setIsSpeaking(false);
    utterance.onresume = () => setIsSpeaking(true);

    window.speechSynthesis.speak(utterance);
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
                    <CardTitle className="text-3xl">AI Voiceover Generator</CardTitle>
                    <CardDescription>Convert text into speech directly in your browser. No API key needed.</CardDescription>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="voice"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                <FormLabel>Voice Selection</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a voice..." />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {voices.length > 0 ? voices.map(v => (
                                            <SelectItem key={v.name} value={v.name}>
                                                {v.name}
                                            </SelectItem>
                                        )) : <SelectItem value="loading" disabled>Loading voices...</SelectItem>}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" size="lg" onClick={handlePlayPause} className="self-end h-16 text-xl">
                            {isSpeaking ? (
                            <>
                                <Pause className="mr-2 h-6 w-6" /> Pause
                            </>
                            ) : (
                            <>
                                <Play className="mr-2 h-6 w-6" /> Play
                            </>
                            )}
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <FormField
                            control={form.control}
                            name="rate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Speed (Rate): {field.value}</FormLabel>
                                    <FormControl>
                                        <Slider
                                            min={0.5}
                                            max={2}
                                            step={0.1}
                                            defaultValue={[field.value]}
                                            onValueChange={(vals) => field.onChange(vals[0])}
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
                                    <FormLabel>Tone (Pitch): {field.value}</FormLabel>
                                    <FormControl>
                                        <Slider
                                            min={0}
                                            max={2}
                                            step={0.1}
                                            defaultValue={[field.value]}
                                            onValueChange={(vals) => field.onChange(vals[0])}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                  </form>
                </Form>
                 <Card className="mt-8">
                     <CardHeader>
                        <CardTitle>Important Notes</CardTitle>
                     </CardHeader>
                     <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>
                           <Volume2 className="inline-block h-4 w-4 mr-2" />
                           Voice quality and available voices (including Hindi Male/Female) depend entirely on your browser (Chrome, Safari, etc.) and Operating System (Windows, macOS, Android). This tool uses the voices installed on your device.
                        </p>
                        <p>
                           <Volume2 className="inline-block h-4 w-4 mr-2" />
                           For best results with Hindi voices, we recommend using the latest version of Google Chrome on a Windows or Android device.
                        </p>
                     </CardContent>
                 </Card>
              </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
