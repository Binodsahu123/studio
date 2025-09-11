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
  prompt: `You are an expert SEO content writer. Your task is to generate a comprehensive set of assets based on the user's input.

**Primary Topic:** {{{title}}}
**Language:** {{{language}}}
{{#if shortDescription}}
**Description:** {{{shortDescription}}}
{{/if}}
{{#if additionalTopic}}
**Additional Keyword:** {{{additionalTopic}}}
{{/if}}

**Your tasks are:**

1.  **Write the Article:**
    *   Compose an in-depth article of AT LEAST 1000 WORDS in HTML format.
    *   The article's language must be **{{{language}}}**.
    *   The tone should be conversational yet expert.
    *   Structure the article with catchy <h2> and <h3> tags. Use <p>, <strong>, and <ul> tags appropriately.
    *   **Crucially, DO NOT include an <h1> tag in the article content.** Start directly with the first <h2>.

2.  **Generate SEO Assets:**
    *   **Titles:** Create a list of 10 catchy, SEO-friendly title options.
    *   **Meta Description:** Write a compelling meta description under 160 characters.
    *   **Focus Keywords (Tags):** Provide a comma-separated string of up to 50 relevant keywords.
    *   **Image Titles:** Suggest 8 SEO-friendly titles for images related to the article.

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
