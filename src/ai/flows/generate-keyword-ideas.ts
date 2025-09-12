'use server';
/**
 * @fileOverview A flow to generate keyword ideas with analysis.
 *
 * - generateKeywordIdeas - A function that generates keyword ideas.
 * - GenerateKeywordIdeasInput - The input type for the function.
 * - GenerateKeywordIdeasOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateKeywordIdeasInputSchema = z.object({
  topic: z.string().describe('The topic or category to generate keyword ideas for.'),
});
export type GenerateKeywordIdeasInput = z.infer<typeof GenerateKeywordIdeasInputSchema>;

const KeywordIdeaSchema = z.object({
    keyword: z.string().describe('The suggested SEO keyword.'),
    difficulty: z.enum(['Low', 'Medium', 'High']).describe('Estimated difficulty to rank for this keyword.'),
    difficultyScore: z.number().int().min(0).max(100).describe('A numerical score for difficulty from 0 to 100.'),
    searchVolume: z.enum(['Low', 'Medium', 'High']).describe('Estimated monthly search volume (Low, Medium, or High).'),
    searchVolumeScore: z.number().int().min(0).max(100).describe('A numerical score for search volume from 0 to 100.'),
});

const GenerateKeywordIdeasOutputSchema = z.object({
  keywords: z.array(KeywordIdeaSchema).describe('An array of 10-15 keyword ideas with analysis.'),
});
export type GenerateKeywordIdeasOutput = z.infer<typeof GenerateKeywordIdeasOutputSchema>;


export async function generateKeywordIdeas(input: GenerateKeywordIdeasInput): Promise<GenerateKeywordIdeasOutput> {
  return generateKeywordIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateKeywordIdeasPrompt',
  input: {schema: GenerateKeywordIdeasInputSchema},
  output: {schema: GenerateKeywordIdeasOutputSchema},
  prompt: `You are an expert SEO keyword researcher. Your task is to generate 10-15 keyword ideas for the given topic.

For each keyword, you must provide:
1.  **keyword**: The keyword idea itself.
2.  **difficulty**: The estimated competition to rank for this keyword ('Low', 'Medium', or 'High').
3.  **difficultyScore**: A numerical score for the difficulty from 0-100.
4.  **searchVolume**: The estimated monthly search volume for this keyword ('Low', 'Medium', or 'High').
5.  **searchVolumeScore**: A numerical score for the search volume from 0-100.

Topic: {{{topic}}}

Generate the keyword ideas now.`,
});

const generateKeywordIdeasFlow = ai.defineFlow(
  {
    name: 'generateKeywordIdeasFlow',
    inputSchema: GenerateKeywordIdeasInputSchema,
    outputSchema: GenerateKeywordIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
