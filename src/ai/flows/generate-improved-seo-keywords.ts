'use server';
/**
 * @fileOverview Generates improved SEO keywords for content optimization.
 *
 * - generateImprovedSeoKeywords - A function that enhances SEO keywords.
 * - GenerateImprovedSeoKeywordsInput - The input type for the generateImprovedSeoKeywords function.
 * - GenerateImprovedSeoKeywordsOutput - The return type for the generateImprovedSeoKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImprovedSeoKeywordsInputSchema = z.object({
  originalKeywords: z
    .string()
    .describe('The original SEO keywords to be improved.'),
  contentTopic: z.string().describe('The main topic of the content.'),
});
export type GenerateImprovedSeoKeywordsInput = z.infer<
  typeof GenerateImprovedSeoKeywordsInputSchema
>;

const GenerateImprovedSeoKeywordsOutputSchema = z.object({
  improvedKeywords: z
    .string()
    .describe('The improved SEO keywords for better content discoverability.'),
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
  input: {schema: GenerateImprovedSeoKeywordsInputSchema},
  output: {schema: GenerateImprovedSeoKeywordsOutputSchema},
  prompt: `You are an expert SEO consultant. Your task is to improve the given SEO keywords so they can rank high for the topic.

Original Keywords: {{{originalKeywords}}}
Content Topic: {{{contentTopic}}}

Improved Keywords:`,
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
