'use server';
/**
 * @fileOverview Generates improved SEO keywords and analysis for content optimization.
 *
 * - generateImprovedSeoKeywords - A function that enhances SEO keywords.
 * - GenerateImprovedSeoKeywordsInput - The input type for the generateImprovedSeoKeywords function.
 * - GenerateImprovedSeoKeywordsOutput - The return type for the generateImprovedSeoKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const GenerateImprovedSeoKeywordsInputSchema = z.object({
  originalKeywords: z
    .string()
    .optional()
    .describe('The original SEO keywords to be improved.'),
  contentTopic: z.string().describe('The main topic of the content.'),
});
export type GenerateImprovedSeoKeywordsInput = z.infer<
  typeof GenerateImprovedSeoKeywordsInputSchema
>;

const KeywordAnalysisSchema = z.object({
  keyword: z.string().describe('The suggested SEO keyword.'),
  difficulty: z
    .enum(['Low', 'Medium', 'High'])
    .describe(
      'Estimated difficulty to rank for this keyword (Low, Medium, or High).'
    ),
  viralityPotential: z
    .enum(['Low', 'Medium', 'High'])
    .describe(
      'Estimated potential for content on this topic to go viral (Low, Medium, or High).'
    ),
  suggestedTitles: z
    .array(z.string())
    .describe('An array of 2-3 catchy blog titles for this keyword.'),
});

const GenerateImprovedSeoKeywordsOutputSchema = z.object({
  improvedKeywords: z
    .array(KeywordAnalysisSchema)
    .describe('An array of improved SEO keywords with detailed analysis.'),
});
export type GenerateImprovedSeoKeywordsOutput = z.infer<
  typeof GenerateImprovedSeoKeywordsOutputSchema
>;

export async function generateImprovedSeoKeywords(
  input: GenerateImprovedSeoKeywordsInput
): Promise<GenerateImprovedSeoKeywordsOutput> {
  return generateImprovedSeoKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImprovedSeoKeywordsPrompt',
  model: 'googleai/gemini-1.0-pro',
  input: {schema: GenerateImprovedSeoKeywordsInputSchema},
  output: {
    format: 'json',
    schema: GenerateImprovedSeoKeywordsOutputSchema,
  },
  prompt: `You are an expert SEO strategist and content analyst. Your task is to analyze the provided topic and optional keywords and generate a list of 10-15 improved, high-potential SEO keywords.

For EACH suggested keyword, you must provide a detailed analysis including:
1.  **keyword**: The improved SEO keyword itself.
2.  **difficulty**: Estimate the ranking difficulty as 'Low', 'Medium', or 'High'. 'Low' means easier to rank for, 'High' means very competitive.
3.  **viralityPotential**: Estimate the potential for content about this keyword to go viral as 'Low', 'Medium', or 'High'.
4.  **suggestedTitles**: Provide 2-3 catchy, click-worthy blog titles that would work well for an article targeting this keyword.

Content Topic: {{{contentTopic}}}
{{#if originalKeywords}}
Original Keywords (for context): {{{originalKeywords}}}
{{/if}}

Return the full analysis as a JSON object containing an array of keyword analysis objects.`,
});

const generateImprovedSeoKeywordsFlow = ai.defineFlow(
  {
    name: 'generateImprovedSeoKeywordsFlow',
    inputSchema: GenerateImprovedSeoKeywordsInputSchema,
    outputSchema: GenerateImprovedSeoKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
