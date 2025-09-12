'use server';
/**
 * @fileOverview A flow to remix multiple source articles into a single new one, matching a specific tone.
 *
 * - remixArticle - A function that remixes articles.
 * - RemixArticleInput - The input type for the function.
 * - RemixArticleOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RemixArticleInputSchema = z.object({
  sourceArticles: z
    .string()
    .describe('The combined text content from multiple source articles to be remixed.'),
  toneReferenceArticle: z
    .string()
    .describe('A sample human-written article that defines the desired tone and style.'),
});
export type RemixArticleInput = z.infer<typeof RemixArticleInputSchema>;

const RemixArticleOutputSchema = z.object({
  remixedArticleHtml: z
    .string()
    .describe('The newly generated article, formatted in SEO-friendly HTML.'),
});
export type RemixArticleOutput = z.infer<typeof RemixArticleOutputSchema>;

export async function remixArticle(
  input: RemixArticleInput
): Promise<RemixArticleOutput> {
  return remixArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'remixArticlePrompt',
  input: {schema: RemixArticleInputSchema},
  output: {schema: RemixArticleOutputSchema},
  prompt: `You are an expert content strategist and SEO writer. Your task is to synthesize and rewrite the "Source Articles" into a single, cohesive, and unique article that is Google Discover friendly.

The most important instruction is that the new article's tone, style, sentence structure, and voice MUST perfectly match the "Tone Reference Article".

**Instructions:**
1.  **Analyze the Tone Reference Article:** Deeply understand its writing style—is it casual, professional, witty, technical? Pay attention to sentence length, vocabulary, and paragraph structure.
2.  **Synthesize the Source Articles:** Read through all the source articles to understand the key information, facts, and concepts.
3.  **Write a New Article:** Create a brand-new article by combining the information from the source articles. DO NOT just copy-paste. You must rewrite everything to make it unique.
4.  **Match the Tone:** As you write, ensure the new article sounds exactly like it was written by the same author as the "Tone Reference Article".
5.  **Format as SEO-Friendly HTML:** Structure the final output with appropriate HTML tags. Use multiple catchy <h2> and <h3> headings, <p> for paragraphs, <strong> for important keywords, and lists (<ul>) where appropriate. Do not include <html>, <body>, or <h1> tags.

**Tone Reference Article (Adopt this style):**
\`\`\`
{{{toneReferenceArticle}}}
\`\`\`

**Source Articles (Use this information):**
\`\`\`
{{{sourceArticles}}}
\`\`\`

Now, generate the new, remixed article in HTML format.`,
});

const remixArticleFlow = ai.defineFlow(
  {
    name: 'remixArticleFlow',
    inputSchema: RemixArticleInputSchema,
    outputSchema: RemixArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
