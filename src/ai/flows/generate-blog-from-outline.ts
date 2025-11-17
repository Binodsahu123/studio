'use server';
/**
 * @fileOverview A flow to generate a full blog post from an outline.
 *
 * - generateBlogFromOutline - A function that generates a full article.
 * - GenerateBlogFromOutlineInput - The input type for the function.
 * - GenerateBlogFromOutlineOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const GenerateBlogFromOutlineInputSchema = z.object({
  title: z.string().describe('The main title of the article.'),
  outline: z.string().describe('The HTML outline (using <h2>, <h3>) of the article.'),
});
export type GenerateBlogFromOutlineInput = z.infer<typeof GenerateBlogFromOutlineInputSchema>;

const GenerateBlogFromOutlineOutputSchema = z.object({
  article: z.string().describe('The full, final article content in HTML format. It must not include an <h1> tag.'),
});
export type GenerateBlogFromOutlineOutput = z.infer<typeof GenerateBlogFromOutlineOutputSchema>;

export async function generateBlogFromOutline(input: GenerateBlogFromOutlineInput): Promise<GenerateBlogFromOutlineOutput> {
  return generateBlogFromOutlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogFromOutlinePrompt',
  model: 'googleai/gemini-1.0-pro',
  input: {schema: GenerateBlogFromOutlineInputSchema},
  output: {
    format: 'json',
    schema: GenerateBlogFromOutlineOutputSchema,
  },
  prompt: `You are an expert SEO content writer. Your task is to write an in-depth, well-researched, and engaging article based on the provided title and HTML outline.

**Article Title:** {{{title}}}

**Article Outline:**
\`\`\`html
{{{outline}}}
\`\`\`

**Instructions:**
- Write the full article in HTML format.
- Follow the structure provided in the outline precisely. Use the headings from the outline for your sections.
- Flesh out each section and sub-section with detailed, informative, and engaging content.
- Use paragraphs (<p>), bold tags (<strong>) for important terms, and lists (<ul>, <li>) where appropriate.
- The tone should be conversational yet expert.
- The final output should be ONLY the HTML content for the article body. DO NOT include an <h1> tag for the title, as it will be added separately. Start directly with the first <h2> section.
`,
});

const generateBlogFromOutlineFlow = ai.defineFlow(
  {
    name: 'generateBlogFromOutlineFlow',
    inputSchema: GenerateBlogFromOutlineInputSchema,
    outputSchema: GenerateBlogFromOutlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
