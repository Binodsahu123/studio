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
  model: googleAI.model('gemini-pro'),
  input: {schema: RewriteContentInputSchema},
  output: {schema: RewriteContentOutputSchema},
  prompt: `You are a master wordsmith and style chameleon. Your goal is to rewrite a given text to perfectly mimic a specific tone and style, without altering the core information.

**Your task is to follow these steps:**
1.  **Analyze the Tone Reference:** Deeply analyze the "Rewrite Instructions / Tone Reference". Pay close attention to its vocabulary, sentence structure, paragraph length, use of slang or formal language, and overall voice (e.g., humorous, professional, academic).
2.  **Extract Core Information:** Read the "Original Text" only to understand its key facts, concepts, and message. DO NOT copy its style.
3.  **Rewrite in the New Style:** Write a completely new version of the "Original Text" that conveys the exact same information but is written **EXACTLY** in the style of the "Tone Reference". The final output must be indistinguishable from the reference in terms of style.
4.  **Format the Output:** The final output MUST be clean HTML. Use appropriate tags like <p>, <h2>, <h3>, <strong>, and <ul> where necessary. Do NOT include <html> or <body> tags.

---

**Original Text (The content to be rewritten):**
\`\`\`
{{{originalText}}}
\`\`\`

---

**Rewrite Instructions / Tone Reference (Adopt this style):**
\`\`\`
{{{instructions}}}
\`\`\`

---

Now, generate the rewritten content in HTML format.`,
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
