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
  originalText: z.string().describe('The original text content to be rewritten.'),
  rewriteInstruction: z.string().describe('A clear instruction on how to rewrite the text (e.g., "Make it more professional", "Simplify this for a 5th grader", "Change the tone to be more optimistic").'),
  language: z.string().describe('The target language for the rewritten content.'),
});
export type RewriteContentInput = z.infer<typeof RewriteContentInputSchema>;

const RewriteContentOutputSchema = z.object({
  rewrittenText: z.string().describe('The rewritten content, formatted in HTML.'),
});
export type RewriteContentOutput = z.infer<typeof RewriteContentOutputSchema>;

export async function rewriteContent(input: RewriteContentInput): Promise<RewriteContentOutput> {
  return rewriteContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rewriteContentPrompt',
  input: {schema: RewriteContentInputSchema},
  output: {schema: RewriteContentOutputSchema},
  prompt: `You are an expert content editor. Your task is to rewrite the provided text based on a specific instruction. The output must be in the specified language and formatted as clean HTML.

**Original Text:**
\`\`\`
{{{originalText}}}
\`\`\`

**Instruction on how to rewrite:** "{{{rewriteInstruction}}}"

**Language for the output:** {{{language}}}

Please now provide the rewritten text below, following the instruction precisely. Use appropriate HTML tags like <p>, <strong>, and <ul> where necessary.`,
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
