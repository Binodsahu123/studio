'use server';
/**
 * @fileOverview A flow to generate relevant and trending hashtags from a topic.
 *
 * - generateHashtags - A function that generates hashtags.
 * - GenerateHashtagsInput - The input type for the function.
 * - GenerateHashtagsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHashtagsInputSchema = z.object({
  topic: z.string().describe('The topic or title to generate hashtags for. Use "trending" for general trending hashtags.'),
  platform: z.enum(['Instagram', 'YouTube']).describe('The social media platform for which to generate hashtags.'),
});
export type GenerateHashtagsInput = z.infer<typeof GenerateHashtagsInputSchema>;

const GenerateHashtagsOutputSchema = z.object({
  hashtags: z.array(z.string()).describe('An array of 20-30 generated hashtags, including the # symbol.'),
});
export type GenerateHashtagsOutput = z.infer<typeof GenerateHashtagsOutputSchema>;

export async function generateHashtags(input: GenerateHashtagsInput): Promise<GenerateHashtagsOutput> {
  return generateHashtagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHashtagsPrompt',
  input: {schema: GenerateHashtagsInputSchema},
  output: {schema: GenerateHashtagsOutputSchema},
  prompt: `You are a social media expert specializing in hashtag strategy for {{platform}}. Your task is to generate a list of 20-30 highly relevant, popular, and trending hashtags.

**Instructions:**
- Generate hashtags for the platform: **{{platform}}**.
- The topic is: **{{{topic}}}**.
- If the topic is "trending" or "popular", generate general viral and trending hashtags for the specified platform covering various popular categories.
- Include a mix of popular, niche, and keyword-specific hashtags.
- All hashtags must start with the '#' symbol.
- Return the list as a JSON array of strings.

Generate the hashtags now.`,
});

const generateHashtagsFlow = ai.defineFlow(
  {
    name: 'generateHashtagsFlow',
    inputSchema: GenerateHashtagsInputSchema,
    outputSchema: GenerateHashtagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
