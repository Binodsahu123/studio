
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
import { Volume2, Mic, Square, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  text: z.string().min(5, 'Please enter at least 5 characters.'),
  voiceName: z.string().min(1, 'Please select a voice.'),
});

export default function VoiceoverGeneratorPage() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isApiSupported, setIsApiSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: 'नमस्ते, यह एक टेस्ट है। कृपया अलग-अलग आवाज़ें चुनकर देखें कि वे कैसे काम करती हैं।',
      voiceName: '',
    },
  });

  const updateVoices = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        // Filter for common languages (English and Hindi) to keep list manageable but diverse
        const filtered = allVoices.filter(v => 
          v.lang.toLowerCase().includes('en') || 
          v.lang.toLowerCase().includes('hi')
        ).sort((a, b) => a.name.localeCompare(b.name));
        
        setVoices(filtered);
        
        // Auto-select the first available voice if none is selected
        const currentVoice = form.getValues('voiceName');
        if (!currentVoice && filtered.length > 0) {
          form.setValue('voiceName', filtered[0].name);
        }
      }
    }
  }, [form]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Chrome requires this event to populate voices
      window.speechSynthesis.onvoiceschanged = updateVoices;
      // Try populating immediately for other browsers
      updateVoices();
    } else {
      setIsApiSupported(false);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
      }
    };
  }, [updateVoices]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isApiSupported || !window.speechSynthesis) {
        toast({ title: "Speech API not supported", variant: "destructive"});
        return;
    }

    if (voices.length === 0) {
        toast({ title: "No voices available", description: "Please wait or refresh the page.", variant: "destructive"});
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(values.text);
    
    // Find the exact voice object selected by the user
    const selectedVoice = voices.find(v => v.name === values.voiceName);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech Error:', event);
      setIsSpeaking(false);
      toast({ title: "Speech Error", description: event.error, variant: "destructive"});
    };

    window.speechSynthesis.speak(utterance);
  }

  function handleStop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mic className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Offline Voiceover Generator</CardTitle>
                    <CardDescription>Select different male or female voices from the list below.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isApiSupported ? (
                   <Alert variant="destructive">
                     <AlertDescription>
                       Your browser does not support the Web Speech API.
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
                          <FormLabel>Text to Speak</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter your message here..." 
                              className="resize-none"
                              {...field} 
                              rows={5} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                        control={form.control}
                        name="voiceName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Select Voice (Male/Female/Language)</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={voices.length > 0 ? "Choose a voice..." : "Loading system voices..."} />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {voices.length > 0 ? (
                                      voices.map((voice, idx) => (
                                        <SelectItem key={`${voice.name}-${idx}`} value={voice.name}>
                                            {voice.name} ({voice.lang})
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <div className="flex items-center justify-center p-4">
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        <span>Loading voices...</span>
                                      </div>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <Button 
                          type="submit" 
                          className="flex-1 h-12 text-lg" 
                          disabled={isSpeaking || voices.length === 0}
                        >
                            {isSpeaking ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Speaking...
                              </>
                            ) : (
                              <>
                                <Volume2 className="mr-2 h-5 w-5" />
                                Speak Text
                              </>
                            )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="h-12 text-lg"
                          onClick={handleStop} 
                          disabled={!isSpeaking}
                        >
                            <Square className="mr-2 h-5 w-5" />
                            Stop
                        </Button>
                    </div>
                  </form>
                </Form>
                )}
              </CardContent>
            </Card>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>Tip: These voices depend on your Operating System (Windows/Mac/Android/iOS).</p>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
