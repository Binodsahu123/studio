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
import {googleAI} from '@genkit-ai/google-genai';

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
  model: 'googleai/gemini-1.0-pro',
  input: {schema: GenerateBlogOutlineInputSchema},
  prompt: `You are an expert content strategist. Your task is to create a comprehensive, well-structured blog post outline based on the provided title and keywords.

The outline should be in HTML format. Use <h2> tags for main sections and <h3> tags for sub-sections.
The outline should be logical, flow well, and cover the topic in-depth. Make sure to naturally incorporate the provided keywords.

Blog Title: {{{title}}}
Keywords: {{{keywords}}}

Generate the HTML outline. Do not include <h1>, <p> or <body> tags. Just the headings.

Return the full output as a JSON object inside a \`\`\`json ... \`\`\` code block with the key "outline".`,
});

const generateBlogOutlineFlow = ai.defineFlow(
  {
    name: 'generateBlogOutlineFlow',
    inputSchema: GenerateBlogOutlineInputSchema,
    outputSchema: GenerateBlogOutlineOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    const jsonText = response.text.replace(/^```json\n/, '').replace(/\n```$/, '');
    return JSON.parse(jsonText);
  }
);
