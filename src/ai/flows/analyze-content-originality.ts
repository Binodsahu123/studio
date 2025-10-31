'use server';
/**
 * @fileOverview A flow to analyze the originality of a given text content.
 *
 * - analyzeContentOriginality - A function that analyzes text for AI generation probability.
 * - AnalyzeContentOriginalityInput - The input type for the function.
 * - AnalyzeContentOriginalityOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const AnalyzeContentOriginalityInputSchema = z.object({
  text: z.string().describe('The text content to be analyzed.'),
});
export type AnalyzeContentOriginalityInput = z.infer<
  typeof AnalyzeContentOriginalityInputSchema
>;

const AnalyzeContentOriginalityOutputSchema = z.object({
  aiScore: z
    .number()
    .describe(
      'A score from 0 to 100 representing the likelihood that the content is AI-generated. 100 means very likely AI-generated.'
    ),
  analysis: z
    .string()
    .describe(
      'A brief, human-readable analysis explaining the score and findings.'
    ),
  plagiarismWarning: z
    .string()
    .describe(
      "A warning about potential plagiarism if the text is too generic or seems unoriginal. This is not a formal plagiarism check."
    ),
  highlightedText: z
    .string()
    .describe(
      'The original text with parts suspected to be AI-generated wrapped in <ai-detected> tags. For example: "This is human text. <ai-detected>This part seems AI-written.</ai-detected>"'
    ),
});
export type AnalyzeContentOriginalityOutput = z.infer<
  typeof AnalyzeContentOriginalityOutputSchema
>;

export async function analyzeContentOriginality(
  input: AnalyzeContentOriginalityInput
): Promise<AnalyzeContentOriginalityOutput> {
  return analyzeContentOriginalityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeContentOriginalityPrompt',
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: AnalyzeContentOriginalityInputSchema},
  output: {schema: AnalyzeContentOriginalityOutputSchema},
  prompt: `You are an expert AI content detector. Your task is to analyze the following text and determine the probability that it was written by an AI. You are not a plagiarism checker, but you should flag text that seems overly generic or unoriginal.

Analyze the text based on factors like complexity, word choice, sentence structure, and typical AI writing patterns (e.g., excessive use of transitional phrases, repetitive sentence starts, overly formal tone).

Text to Analyze:
{{{text}}}

Based on your analysis, provide the following:
1.  **aiScore**: An integer score between 0 and 100. A score of 0 means it is certainly human-written, while 100 means it is certainly AI-generated.
2.  **analysis**: A brief, 1-2 sentence explanation of your reasoning for the score. Be concise and clear.
3.  **plagiarismWarning**: If the text seems highly generic or lacks originality, provide a brief warning like "The text appears generic and may lack originality." Otherwise, state "No major originality concerns detected."
4.  **highlightedText**: Return the original text. For every sentence or phrase that you strongly suspect is AI-generated, wrap it in <ai-detected> XML tags. For example: "This is human text. <ai-detected>This part seems AI-written.</ai-detected>". If no part is detected as AI-written, return the original text without any tags.
`,
});

const analyzeContentOriginalityFlow = ai.defineFlow(
  {
    name: 'analyzeContentOriginalityFlow',
    inputSchema: AnalyzeContentOriginalityInputSchema,
    outputSchema: AnalyzeContentOriginalityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
