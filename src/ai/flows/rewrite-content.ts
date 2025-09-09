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

// Example texts for different tones
const toneExamples = {
    'Casual Blog Post': `Today, I finally got my hands on the new "Chrono-Lander" smartwatch, and I'm buzzing! First off, the unboxing experience was a treat. The packaging is super sleek. Setting it up was a breeze—just a few taps and it was synced with my phone. The screen is gorgeous, and the strap feels really comfy. I took it for a spin on my evening run, and the GPS tracking was spot on. Honestly, I'm already impressed. Can't wait to see what else this thing can do over the next few days!`,
    'Professional Email': `Dear Team,\n\nI hope this email finds you well.\n\nFollowing up on our discussion from the Q3 planning meeting, I have attached the finalized project roadmap for your review. Please take a moment to look over the key deliverables and timelines outlined within the document.\n\nYour feedback is highly valuable. Kindly provide any comments or suggestions by end of business on Friday, October 28th, so we can move forward with the next phase.\n\nThank you for your cooperation.\n\nBest regards,\nAlex Chen\nProject Manager`,
    'News Report': `New data released by the National Statistics Bureau today reveals a significant shift in consumer spending habits over the past fiscal quarter. The report indicates a 15% decrease in spending on non-essential goods, while the services sector saw a surprising 8% surge. Economists suggest these figures reflect growing market uncertainty and a reprioritization of household budgets. The government is expected to issue a formal statement later this week in response to these findings.`,
};

const RewriteContentInputSchema = z.object({
  originalText: z
    .string()
    .describe('The original text content to be rewritten.'),
  toneCategory: z
    .enum(Object.keys(toneExamples) as [string, ...string[]])
    .describe(
      'The desired tone and style for the rewritten text, based on predefined categories.'
    ),
  language: z
    .string()
    .describe('The target language for the rewritten content.'),
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
  // Select the example text based on the chosen category
  const exampleText = toneExamples[input.toneCategory];
  return rewriteContentFlow({...input, exampleText});
}

const RewriteFlowInputSchema = RewriteContentInputSchema.extend({
    exampleText: z.string()
});

const prompt = ai.definePrompt({
  name: 'rewriteContentPrompt',
  input: {schema: RewriteFlowInputSchema},
  output: {schema: RewriteContentOutputSchema},
  prompt: `You are an expert content editor. Your task is to rewrite the "Original Text" to match the tone and style of the "Example Text". The final output must be in the specified "Language" and formatted as clean HTML.

**Language for the output:** {{{language}}}

**Example Text (This defines the tone and style you must adopt):**
\`\`\`
{{{exampleText}}}
\`\`\`

**Original Text (Rewrite this text):**
\`\`\`
{{{originalText}}}
\`\`\`

Please now provide the rewritten text below, fully adopting the style, tone, and sentence structure of the example. Use appropriate HTML tags like <p>, <strong>, and <ul> where necessary.`,
});

const rewriteContentFlow = ai.defineFlow(
  {
    name: 'rewriteContentFlow',
    inputSchema: RewriteFlowInputSchema,
    outputSchema: RewriteContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
