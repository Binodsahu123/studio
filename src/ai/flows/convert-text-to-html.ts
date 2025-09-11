'use server';
/**
 * @fileOverview A flow to convert plain text into SEO-friendly HTML.
 *
 * - convertTextToHtml - A function that converts text to HTML.
 * - ConvertTextToHtmlInput - The input type for the function.
 * - ConvertTextToHtmlOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConvertTextToHtmlInputSchema = z.object({
  text: z
    .string()
    .describe('The plain text content to be converted to HTML.'),
});
export type ConvertTextToHtmlInput = z.infer<
  typeof ConvertTextToHtmlInputSchema
>;

const ConvertTextToHtmlOutputSchema = z.object({
  htmlContent: z
    .string()
    .describe('The generated SEO-friendly HTML content.'),
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
  input: {schema: ConvertTextToHtmlInputSchema},
  output: {schema: ConvertTextToHtmlOutputSchema},
  prompt: `You are an expert SEO content formatter for WordPress, behaving like the DeepSeek AI model. Your task is to convert the following plain text into a well-structured, SEO-friendly HTML document.

**Instructions:**
- Use the exact text provided. Do not add any new content or words from outside. Do not be overly creative.
- Add appropriate HTML tags like <h2> for main headings, <h3> for subheadings, and <p> for paragraphs.
- Use <strong> tags for important keywords to make them stand out.
- The output must be only the HTML content, ready to be pasted into a WordPress code editor.
- Do not include <html>, <body>, or <h1> tags.

**Plain Text to Convert:**
\`\`\`
{{{text}}}
\`\`\`

Now, generate the HTML content based on these instructions.`,
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
