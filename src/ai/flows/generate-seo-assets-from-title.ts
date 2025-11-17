'use server';
/**
 * @fileOverview A flow to generate SEO assets (tags, hashtags, description) from a title.
 *
 * - generateSeoAssetsFromTitle - A function that generates these assets.
 * - GenerateSeoAssetsFromTitleInput - The input type for the function.
 * - GenerateSeoAssetsFromTitleOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const GenerateSeoAssetsFromTitleInputSchema = z.object({
  title: z.string().describe('The title of the content to generate assets for.'),
});
export type GenerateSeoAssetsFromTitleInput = z.infer<
  typeof GenerateSeoAssetsFromTitleInputSchema
>;

const GenerateSeoAssetsFromTitleOutputSchema = z.object({
  tags: z
    .string()
    .describe(
      'A comma-separated string of relevant SEO keywords/tags based on the title.'
    ),
  hashtags: z
    .array(z.string())
    .describe(
      'An array of 15-20 relevant and trending social media hashtags, including the # symbol.'
    ),
  description: z
    .string()
    .describe(
      'A compelling, SEO-friendly meta description (under 160 characters) based on the title and tags.'
    ),
});
export type GenerateSeoAssetsFromTitleOutput = z.infer<
  typeof GenerateSeoAssetsFromTitleOutputSchema
>;

export async function generateSeoAssetsFromTitle(
  input: GenerateSeoAssetsFromTitleInput
): Promise<GenerateSeoAssetsFromTitleOutput> {
  return generateSeoAssetsFromTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSeoAssetsFromTitlePrompt',
  model: 'googleai/gemini-1.0-pro',
  input: {schema: GenerateSeoAssetsFromTitleInputSchema},
  prompt: `You are an expert SEO and social media strategist. Your task is to generate key assets for a piece of content based on its title.

**Content Title:** {{{title}}}

**Instructions:**
1.  **Analyze the title** to understand the core topic and intent.
2.  **Generate SEO Tags:** Create a comma-separated string of 10-15 highly relevant SEO keywords (tags) that have low competition but high search potential.
3.  **Generate Hashtags:** Create a list of 15-20 trending and viral hashtags suitable for platforms like Instagram and YouTube. Include a mix of broad and niche hashtags. All hashtags must start with '#'.
4.  **Write a Meta Description:** Based on the title and the tags you generated, write a compelling, click-worthy meta description that is under 160 characters.

Provide the output in a single JSON object inside a \`\`\`json ... \`\`\` code block with the keys "tags", "hashtags", and "description".`,
});

const generateSeoAssetsFromTitleFlow = ai.defineFlow(
  {
    name: 'generateSeoAssetsFromTitleFlow',
    inputSchema: GenerateSeoAssetsFromTitleInputSchema,
    outputSchema: GenerateSeoAssetsFromTitleOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    const jsonText = response.text.replace(/^```json\n/, '').replace(/\n```$/, '');
    return JSON.parse(jsonText);
  }
);
