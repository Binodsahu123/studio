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
import {googleAI} from '@genkit-ai/google-genai';

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
  model: 'googleai/gemini-1.0-pro',
  input: {schema: RewriteContentInputSchema},
  output: {
    format: 'json',
    schema: RewriteContentOutputSchema,
  },
  prompt: `You are a master wordsmith and style chameleon. Your primary and ONLY task is to rewrite the "Original Text" provided below so that it perfectly matches the tone, style, sentence structure, and voice of the "Rewrite Instructions / Tone Reference".

Your goal is to be an invisible rewriter. The rewritten text should feel like it was authored by the same person who wrote the tone reference. You MUST NOT add any new information or concepts that are not present in the original text. You MUST NOT copy the style of the original text.

**Follow these steps precisely:**
1.  **Deeply Analyze the Tone Reference:** Understand its vocabulary, sentence complexity, paragraph length, and overall voice (e.g., formal, casual, humorous, technical).
2.  **Extract Core Information:** Read the "Original Text" only to understand its key facts, message, and information.
3.  **Rewrite in the New Style:** Write a completely new version of the "Original Text" that conveys the exact same information but is written **EXACTLY** in the style of the "Tone Reference".

---

**Original Text (The content to be rewritten):**
\`\`\`
{{{originalText}}}
\`\`\`

---

**Rewrite Instructions / Tone Reference (Adopt this style EXACTLY):**
\`\`\`
{{{instructions}}}
\`\`\`

---

Now, generate the rewritten content. The output **MUST** be clean HTML. Use appropriate tags like <p>, <h2>, <h3>, <strong>, and <ul> where necessary. DO NOT include <html> or <body> tags.`,
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
