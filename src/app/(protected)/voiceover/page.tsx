
// src/app/voiceover/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Volume2, Mic, Square, Loader2, AlertCircle } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  text: z.string().min(1, 'Please enter some text.'),
  voiceName: z.string().min(1, 'Please select a voice.'),
});

export default function VoiceoverGeneratorPage() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isApiSupported, setIsApiSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { toast } = useToast();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: 'नमस्ते, यह एक टेस्ट है। आप यहाँ पुरुष या महिला की आवाज़ चुन सकते हैं।',
      voiceName: '',
    },
  });

  const loadVoices = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        // Filter for English and Hindi to keep the list clean but functional
        const filtered = allVoices.filter(v => 
          v.lang.toLowerCase().includes('hi') || 
          v.lang.toLowerCase().includes('en')
        ).sort((a, b) => a.name.localeCompare(b.name));
        
        setVoices(filtered);
        
        // Auto-select first voice if none selected
        if (!form.getValues('voiceName') && filtered.length > 0) {
          form.setValue('voiceName', filtered[0].name);
        }
      }
    }
  }, [form]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
      
      // Some browsers need a little nudge to load voices
      const interval = setInterval(() => {
        if (window.speechSynthesis.getVoices().length > 0) {
          loadVoices();
          clearInterval(interval);
        }
      }, 500);

      return () => {
        clearInterval(interval);
        if (window.speechSynthesis) {
          window.speechSynthesis.onvoiceschanged = null;
          window.speechSynthesis.cancel();
        }
      };
    } else {
      setIsApiSupported(false);
    }
  }, [loadVoices]);

  const handleStop = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!window.speechSynthesis) return;

    // Always cancel current speech first
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const selectedVoice = voices.find(v => v.name === values.voiceName);
    if (!selectedVoice) {
      toast({
        title: "Voice not found",
        description: "Please select another voice from the list.",
        variant: "destructive",
      });
      return;
    }

    // Add a tiny delay to ensure cancel is fully processed
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(values.text);
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (event) => {
          // Check if error is not 'interrupted' which happens on manual stop
          if (event.error !== 'interrupted') {
            console.error('SpeechSynthesis error:', event);
            toast({
              title: "Speech Error",
              description: `Reason: ${event.error || 'Unknown error occurred'}`,
              variant: "destructive",
            });
          }
          setIsSpeaking(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Submission error:', error);
        setIsSpeaking(false);
      }
    }, 100);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Offline Voiceover</CardTitle>
                  <CardDescription>
                    आवाज़ें आपके डिवाइस पर निर्भर करती हैं। आप पुरुष या महिला की आवाज़ यहाँ से बदल सकते हैं।
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isApiSupported ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Not Supported</AlertTitle>
                  <AlertDescription>
                    Your browser does not support offline speech synthesis.
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
                          <FormLabel className="text-base font-semibold">Text to Convert</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="यहाँ वह टेक्स्ट लिखें जिसे आप बुलवाना चाहते हैं..." 
                              className="min-h-[150px] text-lg resize-none border-2 focus-visible:ring-primary"
                              {...field} 
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
                          <FormLabel className="text-base font-semibold">Select Character / Voice</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={voices.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 border-2">
                                <SelectValue placeholder={voices.length > 0 ? "Choose a voice..." : "Loading system voices..."} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {voices.map((voice, idx) => (
                                <SelectItem key={`${voice.name}-${idx}`} value={voice.name}>
                                  {voice.name} ({voice.lang})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            यहाँ आपको आपके सिस्टम में उपलब्ध पुरुष और महिला की आवाज़ें दिखेंगी।
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                      <Button 
                        type="submit" 
                        className="flex-1 h-14 text-lg font-bold shadow-md hover:scale-[1.02] transition-transform" 
                        disabled={isSpeaking || voices.length === 0}
                      >
                        {isSpeaking ? (
                          <>
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            Speaking...
                          </>
                        ) : (
                          <>
                            <Volume2 className="mr-2 h-6 w-6" />
                            Speak Now
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="h-14 px-8 text-lg font-semibold border-2"
                        onClick={handleStop} 
                        disabled={!isSpeaking}
                      >
                        <Square className="mr-2 h-5 w-5 fill-current" />
                        Stop
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-secondary/30 border-none">
              <CardContent className="p-4 flex items-center gap-3">
                <Volume2 className="h-5 w-5 text-primary" />
                <p className="text-sm">इंटरनेट के बिना काम करता है (No API Key needed)</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary/30 border-none">
              <CardContent className="p-4 flex items-center gap-3">
                <Mic className="h-5 w-5 text-primary" />
                <p className="text-sm">सिस्टम के सभी मेल/फीमेल वॉयस उपलब्ध हैं</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
