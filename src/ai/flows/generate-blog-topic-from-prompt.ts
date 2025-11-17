'use server';
/**
 * @fileOverview A flow to generate blog topics from a prompt.
 *
 * - generateBlogTopic - A function that generates blog topics from a prompt.
 * - GenerateBlogTopicInput - The input type for the generateBlogTopic function.
 * - GenerateBlogTopicOutput - The return type for the generateBlogTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const GenerateBlogTopicInputSchema = z.object({
  prompt: z.string().describe('The prompt to generate blog topics from.'),
});
export type GenerateBlogTopicInput = z.infer<typeof GenerateBlogTopicInputSchema>;

const GenerateBlogTopicOutputSchema = z.object({
  topics: z.array(z.string()).describe('The generated blog topics.'),
});
export type GenerateBlogTopicOutput = z.infer<typeof GenerateBlogTopicOutputSchema>;

export async function generateBlogTopic(input: GenerateBlogTopicInput): Promise<GenerateBlogTopicOutput> {
  return generateBlogTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogTopicPrompt',
  model: 'googleai/gemini-pro',
  input: {schema: GenerateBlogTopicInputSchema},
  output: {
    format: 'json',
    schema: GenerateBlogTopicOutputSchema,
  },
  prompt: `You are a blog topic generator. Generate 5 blog topics from the following prompt: {{{prompt}}}. Return the topics as a JSON array of strings.\n`,
});

const generateBlogTopicFlow = ai.defineFlow(
  {
    name: 'generateBlogTopicFlow',
    inputSchema: GenerateBlogTopicInputSchema,
    outputSchema: GenerateBlogTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
