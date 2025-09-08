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
  title: z.string().describe('The main title or topic of the content. Include phone specifications here if applicable.'),
  shortDescription: z.string().describe('A short description of the content.'),
  language: z.string().describe('The language for the generated content (e.g., "English" or "Hindi").'),
  additionalTopic: z.string().describe('An additional topic or keyword to focus on.'),
});
export type GenerateWrittenContentInput = z.infer<typeof GenerateWrittenContentInputSchema>;

const GenerateWrittenContentOutputSchema = z.object({
  content: z.string().describe('The generated written content in HTML format (at least 500 words). It MUST NOT include an <h1> tag.'),
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
  prompt: `You are an expert SEO content writer. Your task is to write an in-depth, well-researched, and Google Discover-friendly article of AT LEAST 500 WORDS in {{language}} on the topic: "{{title}}". Also generate all the required SEO assets.

**Article Content Guidelines:**
- **Topic:** {{{title}}}
- **Base Description:** {{{shortDescription}}}
- **Additional Keyword:** {{{additionalTopic}}}
- **Language:** {{language}}. If Hindi, use clear and accessible general Hindi.
- **Tone:** Conversational yet expert and informative.
- **Structure:**
  - The article MUST be in HTML format.
  - DO NOT include an <h1> tag or a main title inside the content itself. The content should start directly with the first section heading.
  - Use multiple <h2> tags for main section headings and <h3> for sub-headings.
  - Use <p> for paragraphs, <strong> for important keywords, and at least one <ul> with <li> tags for a bulleted list.
  - Ensure the content flows logically. Do not start with generic headings like "Introduction" or "Parichay".
- **Credibility:** Break down complex concepts into simple terms. Include relevant statistics, examples, or credible opinions.
- **Engagement:** Keep sentences varied and engaging to maintain reader interest. The final article should feel like it was written by a human expert, not AI.

**SEO Asset Generation:**
Based on the generated article and the input title ("{{{title}}}"), create the following assets:

1.  **Titles:** Provide 10 SEO-friendly and click-worthy title options. These titles should incorporate any specifications mentioned in the input title.
2.  **Meta Description:** Create a compelling meta description (under 160 characters).
3.  **Meta Tags:** Provide a comma-separated string of a maximum of 50 focus keywords, suitable for the Rank Math SEO plugin.
4.  **Image Titles:** Create 8 SEO-friendly titles for images that would be used in the article. These titles should be relevant to the content and also include specifications from the input title.
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
    // Fallback for titles if the model doesn't generate them
    if (!output!.titles || output!.titles.length === 0) {
      output!.titles = [input.title];
    }
    return output!;
  }
);
