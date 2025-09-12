'use server';
/**
 * @fileOverview A flow to convert plain text into structured HTML.
 *
 * - convertTextToHtml - A function that takes plain text and converts it to HTML.
 * - ConvertTextToHtmlInput - The input type for the function.
 * - ConvertTextToHtmlOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConvertTextToHtmlInputSchema = z.object({
  plainText: z.string().describe('The plain text to be converted to HTML.'),
});
export type ConvertTextToHtmlInput = z.infer<
  typeof ConvertTextToHtmlInputSchema
>;

const ConvertTextToHtmlOutputSchema = z.object({
  htmlContent: z
    .string()
    .describe(
      'The converted HTML content, structured with headings (h2, h3), paragraphs (p), and bold tags (strong).'
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
  input: {schema: ConvertTextToHtmlInputSchema},
  output: {schema: ConvertTextToHtmlOutputSchema},
  prompt: `You are an expert HTML formatter. Your task is to convert the following plain text into well-structured, SEO-friendly HTML.

**Instructions:**
- Analyze the structure of the text to identify headings, subheadings, and paragraphs.
- Use <h2> for main headings and <h3> for subheadings.
- Wrap all body text in <p> tags.
- Identify and wrap important keywords or phrases with <strong> tags.
- Do not add any classes or styles to the HTML tags.
- Ensure the output is clean HTML.

**Plain Text to Convert:**
\`\`\`
{{{plainText}}}
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
