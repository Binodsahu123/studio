'use server';
/**
 * @fileOverview A flow to rewrite existing text content based on specific instructions.
 *
 * - rewriteContent - A function that rewrites text.
 * - RewriteContentInput - The input type for the function.
 * - RewriteContentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteContentInputSchema = z.object({
  originalText: z
    .string()
    .describe('The original text content to be rewritten.'),
  instructions: z
    .string()
    .describe(
      'Specific instructions for rewriting the text, which can include a tone reference sample.'
    ),
});
export type RewriteContentInput = z.infer<typeof RewriteContentInputSchema>;

const RewriteContentOutputSchema = z.object({
  rewrittenText: z
    .string()
    .describe('The rewritten content, formatted in HTML.'),
});
export type RewriteContentOutput = z.infer<typeof RewriteContentOutputSchema>;


export async function rewriteContent(
  input: RewriteContentInput
): Promise<RewriteContentOutput> {
  return rewriteContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rewriteContentPrompt',
  input: {schema: RewriteContentInputSchema},
  output: {schema: RewriteContentOutputSchema},
  prompt: `You are an expert content editor. Your primary task is to rewrite the "Original Text" to perfectly match the tone, style, and voice of the provided "Rewrite Instructions / Tone Reference".

**Original Text (The content to be rewritten):**
\`\`\`
{{{originalText}}}
\`\`\`

**Rewrite Instructions / Tone Reference (Adopt this style):**
\`\`\`
{{{instructions}}}
\`\`\`

Please now provide the rewritten text below, fully following the style of the reference. Format the output as clean HTML. Use appropriate tags like <p>, <h2>, <h3>, <strong>, and <ul> where necessary.`,
});

const rewriteContentFlow = ai.defineFlow(
  {
    name: 'rewriteContentFlow',
    inputSchema: RewriteContentInputSchema,
    outputSchema: RewriteContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
