'use server';
/**
 * @fileOverview A flow to generate relevant hashtags and SEO tags from a topic or category.
 *
 * - generateHashtags - A function that generates hashtags and tags.
 * - GenerateHashtagsInput - The input type for the function.
 * - GenerateHashtagsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const GenerateHashtagsInputSchema = z.object({
  topic: z.string().describe('The topic, category, or title to generate hashtags and tags for.'),
  platform: z.enum(['Instagram', 'YouTube']).describe('The social media platform for which to generate hashtags.'),
});
export type GenerateHashtagsInput = z.infer<typeof GenerateHashtagsInputSchema>;

const GenerateHashtagsOutputSchema = z.object({
  hashtags: z.array(z.string()).describe('An array of 20-30 generated hashtags, including the # symbol.'),
  tags: z.string().describe('A comma-separated string of 15-20 relevant SEO keywords/tags.'),
});
export type GenerateHashtagsOutput = z.infer<typeof GenerateHashtagsOutputSchema>;

export async function generateHashtags(input: GenerateHashtagsInput): Promise<GenerateHashtagsOutput> {
  return generateHashtagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHashtagsPrompt',
  model: 'googleai/gemini-1.0-pro',
  input: {schema: GenerateHashtagsInputSchema},
  output: {
    format: 'json',
    schema: GenerateHashtagsOutputSchema,
  },
  prompt: `You are a social media and SEO expert. Your task is to generate a list of hashtags and SEO tags based on a specific topic.

**Instructions:**
1.  **Hashtags:** Generate a list of 20-30 highly relevant, popular, and trending hashtags for the platform: **{{platform}}**.
    - Include a mix of popular (high-traffic), niche (specific), and keyword-specific hashtags.
    - All hashtags must start with the '#' symbol.

2.  **SEO Tags:** Generate a comma-separated string of 15-20 relevant SEO keywords (tags). These should be suitable for a blog post or website content.

**Topic/Category:** **{{{topic}}}**

Return the full output as a JSON object with 'hashtags' and 'tags' keys.

Generate the assets now.`,
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
