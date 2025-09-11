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
  prompt: `You are an expert content writer and SEO specialist. Your task is to write an in-depth, well-researched, and engaging article on the topic provided.

**Instructions:**
- **Language**: The entire output, including the article, titles, description, tags, and image titles, MUST be in **{{{language}}}**.
- **Topic**: "{{{title}}}"
{{#if shortDescription}}
- **Description**: {{{shortDescription}}}
{{/if}}
{{#if additionalTopic}}
- **Additional Focus**: {{{additionalTopic}}}
{{/if}}

- **Article Content**:
  - Write a high-quality, comprehensive article that is Google Discover friendly.
  - Structure the article naturally with a clear introduction, detailed body, and a strong conclusion.
  - The tone should be conversational yet informative, like an expert explaining the topic.
  - Break down complex ideas into simple terms. Use statistics, examples, or expert opinions to add credibility.
  - The final article must be in HTML format. It MUST NOT include an <h1> tag. Use multiple catchy <h2> and <h3> headings, <p> for paragraphs, <strong> for important keywords, and lists (<ul>) where appropriate.

- **Generated Assets**:
  1.  **titles:** An array of 10 catchy, SEO-friendly title options for the article, in the specified language.
  2.  **description:** A compelling meta description under 160 characters, in the specified language.
  3.  **tags:** A comma-separated string of up to 50 relevant focus keywords, in the specified language.
  4.  **imageTitles:** An array of 8 SEO-friendly image titles related to the content, in the specified language.

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
    
    if (!output) {
      throw new Error("Content generation failed.");
    }

    // Fallback for titles if the model doesn't generate them
    if (!output.titles || output.titles.length === 0) {
      output.titles = [input.title];
    }
    
    return output;
  }
);
