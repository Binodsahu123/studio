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

const ConvertTextToHtmlInputSchema = z.object({
  text: z.string().describe('The plain text to be converted to HTML.'),
});
export type ConvertTextToHtmlInput = z.infer<
  typeof ConvertTextToHtmlInputSchema
>;

const ConvertTextToHtmlOutputSchema = z.object({
  htmlContent: z
    .string()
    .describe('The resulting structured and semantic HTML.'),
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
  prompt: `You are an expert web developer. Your task is to convert the following plain text into well-structured, semantic HTML.

**Instructions:**
- Analyze the provided text to identify headings, paragraphs, lists, and important keywords.
- Use appropriate HTML tags like <h2>, <h3> for headings, <p> for paragraphs, <ul> and <li> for lists, and <strong> for bolding important terms.
- The structure should be logical and reflect the hierarchy of the original text.
- DO NOT include <html>, <body>, or <head> tags in your output. The output should only be the HTML content for the body.
- Ensure the output is clean and properly formatted.

**Plain Text to Convert:**
\`\`\`
{{{text}}}
\`\`\`

Now, generate the HTML content.`,
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
