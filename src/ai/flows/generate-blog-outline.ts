'use server';
/**
 * @fileOverview A flow to generate a blog post outline from a title and keywords.
 *
 * - generateBlogOutline - A function that generates a blog outline.
 * - GenerateBlogOutlineInput - The input type for the function.
 * - GenerateBlogOutlineOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogOutlineInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
  keywords: z.string().describe('A comma-separated list of keywords to include.'),
});
export type GenerateBlogOutlineInput = z.infer<typeof GenerateBlogOutlineInputSchema>;

const GenerateBlogOutlineOutputSchema = z.object({
  outline: z.string().describe('A detailed blog post outline in HTML format, using <h2> and <h3> tags.'),
});
export type GenerateBlogOutlineOutput = z.infer<typeof GenerateBlogOutlineOutputSchema>;

export async function generateBlogOutline(input: GenerateBlogOutlineInput): Promise<GenerateBlogOutlineOutput> {
  return generateBlogOutlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogOutlinePrompt',
  input: {schema: GenerateBlogOutlineInputSchema},
  output: {schema: GenerateBlogOutlineOutputSchema},
  prompt: `You are an expert content strategist, behaving like the DeepSeek AI model. Your task is to create a comprehensive, well-structured blog post outline based on the provided title and keywords.

The outline should be in HTML format. Use <h2> tags for main sections and <h3> tags for sub-sections.
The outline should be logical, flow well, and cover the topic in-depth. Make sure to naturally incorporate the provided keywords.

Blog Title: {{{title}}}
Keywords: {{{keywords}}}

Generate the HTML outline. Do not include <h1>, <p> or <body> tags. Just the headings.`,
});

const generateBlogOutlineFlow = ai.defineFlow(
  {
    name: 'generateBlogOutlineFlow',
    inputSchema: GenerateBlogOutlineInputSchema,
    outputSchema: GenerateBlogOutlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
