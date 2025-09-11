'use server';
/**
 * @fileOverview A flow to generate written content from a title, description, language, and topic.
 * 
 * - generateWrittenContent - A function that generates content.
 * - GenerateWrittenContentInput - The input type for the function.
 * - GenerateWrittenContentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWrittenContentInputSchema = z.object({
  title: z.string().describe('The main title or topic of the content.'),
  shortDescription: z.string().optional().describe('A short description of the content.'),
  language: z.string().describe('The language for the generated content (e.g., "English" or "Hindi").'),
  additionalTopic: z.string().optional().describe('An additional topic or keyword to focus on.'),
});
export type GenerateWrittenContentInput = z.infer<typeof GenerateWrittenContentInputSchema>;

const GenerateWrittenContentOutputSchema = z.object({
  content: z.string().describe('The generated written content in HTML format (around 1000 words). It MUST NOT include an <h1> tag.'),
  titles: z.array(z.string()).describe('An array of 10 catchy, SEO-friendly, and click-worthy title options for the article. The titles should incorporate specifications from the input title.'),
  description: z.string().describe('A meta description for SEO purposes, under 160 characters.'),
  tags: z.string().describe('A comma-separated string of up to 50 relevant focus keywords for Rank Math SEO plugin.'),
  imageTitles: z.array(z.string()).describe('An array of 8 SEO-friendly image titles related to the content, incorporating specifications from the input title.'),
});
export type GenerateWrittenContentOutput = z.infer<typeof GenerateWrittenContentOutputSchema>;

export async function generateWrittenContent(input: GenerateWrittenContentInput): Promise<GenerateWrittenContentOutput> {
  return generateWrittenContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWrittenContentPrompt',
  input: {schema: GenerateWrittenContentInputSchema},
  output: {schema: GenerateWrittenContentOutputSchema},
  prompt: `You are a human expert who deeply understands the subject. Write an in-depth, well-researched, Google Discover-friendly article on "{{{title}}}".

**Instructions:**
- **Language:** The entire article and all related assets must be in **{{{language}}}**. If the language is Hindi, use general Hindi that is clear and accessible to a broad audience.
- **Tone:** Use a conversational yet informative tone. Avoid robotic or generic writing.
- **Structure:**
    - The article should be AT LEAST 1000 WORDS and formatted in HTML.
    - DO NOT include an <h1> tag. Start directly with the first <h2>.
    - Structure the article naturally with a proper introduction, detailed body sections (using <h2> and <h3>), and a strong conclusion.
    - Break down complex concepts into simple terms.
    - Keep sentences varied and engaging to maintain reader interest.
- **Content Quality:**
    - Provide clear explanations, examples, and insights.
    - Where necessary, include relevant statistics, case studies, or expert opinions to add credibility.
{{#if shortDescription}}
- **Core Focus:** Base the article on this description: "{{{shortDescription}}}"
{{/if}}
{{#if additionalTopic}}
- **Additional Focus:** Also incorporate this keyword: "{{{additionalTopic}}}"
{{/if}}

**SEO Asset Generation:**
After writing the article, create the following assets:
1.  **titles:** An array of 10 catchy, SEO-friendly title options.
2.  **description:** A compelling meta description under 160 characters.
3.  **tags:** A comma-separated string of up to 50 relevant focus keywords.
4.  **imageTitles:** An array of 8 SEO-friendly image titles related to the content.

Return all of this in a single, valid JSON object.`,
});


const generateWrittenContentFlow = ai.defineFlow(
  {
    name: 'generateWrittenContentFlow',
    inputSchema: GenerateWrittenContentInputSchema,
    outputSchema: GenerateWrittenContentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    // Fallback for titles if the model doesn't generate them
    if (!output!.titles || output!.titles.length === 0) {
      output!.titles = [input.title];
    }
    return output!;
  }
);
