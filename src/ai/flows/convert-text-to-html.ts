'use server';
/**
 * @fileOverview A flow to convert plain text to structured HTML.
 *
 * - convertTextToHtml - A function that takes plain text and converts it to HTML.
 * - ConvertTextToHtmlInput - The input type for the function.
 * - ConvertTextToHtmlOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const ConvertTextToHtmlInputSchema = z.object({
  text: z.string().describe('The plain text to be converted to HTML.'),
});
export type ConvertTextToHtmlInput = z.infer<
  typeof ConvertTextToHtmlInputSchema
>;

const ConvertTextToHtmlOutputSchema = z.object({
  htmlContent: z
    .string()
    .describe(
      'The converted HTML content, including headings, paragraphs, lists, and bold tags.'
    ),
});
export type ConvertTextToHtmlOutput = z.infer<
  typeof ConvertTextToHtmlOutputSchema
>;

export async function convertTextToHtml(
  input: ConvertTextToHtmlInput
): Promise<ConvertTextToHtmlOutput> {
  return convertTextToHtmlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'convertTextToHtmlPrompt',
  model: 'googleai/gemini-pro',
  input: {schema: ConvertTextToHtmlInputSchema},
  output: {
    format: 'json',
    schema: ConvertTextToHtmlOutputSchema,
  },
  prompt: `You are an intelligent text-to-HTML converter. Your task is to take the provided plain text and transform it into well-structured, SEO-friendly HTML.

**Instructions:**
- Analyze the text to identify headings, subheadings, paragraphs, and potential lists.
- Use <h2> for main titles, <h3> for sub-sections, and <p> for body text.
- Identify important keywords or phrases and wrap them in <strong> tags for emphasis.
- If you find a series of related items, format them as an unordered list (<ul> with <li> tags).
- Ensure the final output is clean HTML. Do not include <html>, <body>, or <h1> tags.

**Plain Text to Convert:**
\`\`\`
{{{text}}}
\`\`\`

Generate the HTML content now.`,
});

const convertTextToHtmlFlow = ai.defineFlow(
  {
    name: 'convertTextToHtmlFlow',
    inputSchema: ConvertTextToHtmlInputSchema,
    outputSchema: ConvertTextToHtmlOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
