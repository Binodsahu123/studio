'use server';
/**
 * @fileOverview A flow to generate written content from a title, description, language, and topic.
 * 
 * - generateWrittenContent - A function that generates content.
 * - GenerateWrittenContentInput - The input type for the function.
 * - GenerateWrittenContentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWrittenContentInputSchema = z.object({
  title: z.string().describe('The title of the content.'),
  shortDescription: z.string().describe('A short description of the content.'),
  language: z.string().describe('The language for the generated content (e.g., "English" or "Hindi").'),
  additionalTopic: z.string().describe('An additional topic or keyword to focus on.'),
});
export type GenerateWrittenContentInput = z.infer<typeof GenerateWrittenContentInputSchema>;

const GenerateWrittenContentOutputSchema = z.object({
  content: z.string().describe('The generated written content.'),
});
export type GenerateWrittenContentOutput = z.infer<typeof GenerateWrittenContentOutputSchema>;

export async function generateWrittenContent(input: GenerateWrittenContentInput): Promise<GenerateWrittenContentOutput> {
  return generateWrittenContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWrittenContentPrompt',
  input: {schema: GenerateWrittenContentInputSchema},
  output: {schema: GenerateWrittenContentOutputSchema},
  prompt: `Write an in-depth, well-researched article in {{language}} that is Google Discover friendly on the topic: "{{title}}".

The article should be structured naturally, providing clear explanations, examples, and insights to help readers fully understand the topic. Use a conversational yet informative tone, making it engaging and easy to read. Ensure the content flows logically, with a proper introduction, detailed body sections based on the short description and additional topic, and a strong conclusion.

- Title: {{{title}}}
- Short Description: {{{shortDescription}}}
- Additional Topic/Keyword: {{{additionalTopic}}}

Avoid robotic or generic writing; instead, write as an expert who deeply understands the subject. If the language is Hindi, use general Hindi that is clear and accessible to a broad audience. Break down complex concepts into simple terms, and where necessary, include relevant statistics, case studies, or expert opinions to add credibility. Keep sentences varied and engaging to maintain reader interest. The final article should feel like it was written by a human expert, not AI.
`,
});

const generateWrittenContentFlow = ai.defineFlow(
  {
    name: 'generateWrittenContentFlow',
    inputSchema: GenerateWrittenContentInputSchema,
    outputSchema: GenerateWrittenContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
