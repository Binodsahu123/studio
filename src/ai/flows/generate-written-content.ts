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
  title: z.string().describe('The title of the content.'),
  shortDescription: z.string().describe('A short description of the content.'),
  language: z.string().describe('The language for the generated content (e.g., "English" or "Hindi").'),
  additionalTopic: z.string().describe('An additional topic or keyword to focus on.'),
});
export type GenerateWrittenContentInput = z.infer<typeof GenerateWrittenContentInputSchema>;

const GenerateWrittenContentOutputSchema = z.object({
  content: z.string().describe('The generated written content in HTML format (at least 500 words).'),
  title: z.string().describe('A catchy and SEO-friendly title for the article.'),
  description: z.string().describe('A meta description for SEO purposes, under 160 characters.'),
  tags: z.array(z.string()).describe('An array of relevant SEO tags or keywords.'),
});
export type GenerateWrittenContentOutput = z.infer<typeof GenerateWrittenContentOutputSchema>;

export async function generateWrittenContent(input: GenerateWrittenContentInput): Promise<GenerateWrittenContentOutput> {
  return generateWrittenContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWrittenContentPrompt',
  input: {schema: GenerateWrittenContentInputSchema},
  output: {schema: GenerateWrittenContentOutputSchema},
  prompt: `You are an expert SEO content writer. Your task is to write an in-depth, well-researched, and SEO-friendly article of AT LEAST 500 WORDS in {{language}} on the topic: "{{title}}". Also generate a separate SEO-friendly title, a meta description (under 160 characters), and an array of relevant tags.

The article MUST be in HTML format and follow modern SEO best practices.
The content should be engaging, easy to read, and structured logically with a proper introduction, detailed body sections, and a strong conclusion.

- **Structure:**
  - Start with an <h1> tag for the main title within the content.
  - Use multiple <h2> tags for main section headings.
  - Use <h3> tags for sub-headings where appropriate.
  - Use <p> tags for paragraphs.
  - Use <strong> for important keywords to emphasize them.
  - Include at least one bulleted list using <ul> and <li> tags.

- **Content Guidelines:**
  - **Topic:** {{{title}}}
  - **Base Description:** {{{shortDescription}}}
  - **Additional Keyword:** {{{additionalTopic}}}
  - **Tone:** Conversational yet expert.
  - **Language:** {{language}}. If Hindi, use clear and accessible language.
  - **Credibility:** Break down complex topics and add credibility with facts or examples.
  - **Length:** Minimum 500 words.

Avoid robotic writing. Write as a human expert who deeply understands the subject.
`,
});

const generateWrittenContentFlow = ai.defineFlow(
  {
    name: 'generateWrittenContentFlow',
    inputSchema: GenerateWrittenContentInputSchema,
    outputSchema: GenerateWrittenContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
