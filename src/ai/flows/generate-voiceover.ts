'use server';
/**
 * @fileOverview A flow to generate a voiceover from text.
 *
 * - generateVoiceover - A function that generates an audio file from text.
 * - GenerateVoiceoverInput - The input type for the function.
 * - GenerateVoiceoverOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateVoiceoverInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  voice: z.string().optional().describe('The voice to use for the speech. Defaults to Algenib.'),
});
export type GenerateVoiceoverInput = z.infer<
  typeof GenerateVoiceoverInputSchema
>;

const GenerateVoiceoverOutputSchema = z.object({
    audioDataUri: z.string().describe("The generated audio as a data URI in WAV format."),
});
export type GenerateVoiceoverOutput = z.infer<
  typeof GenerateVoiceoverOutputSchema
>;

export async function generateVoiceover(
  input: GenerateVoiceoverInput
): Promise<GenerateVoiceoverOutput> {
  return generateVoiceoverFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateVoiceoverFlow = ai.defineFlow(
  {
    name: 'generateVoiceoverFlow',
    inputSchema: GenerateVoiceoverInputSchema,
    outputSchema: GenerateVoiceoverOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: input.voice || 'Algenib' },
          },
        },
      },
      prompt: input.text,
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate audio.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);
    
    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
