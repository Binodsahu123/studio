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
import {googleAI} from '@genkit-ai/google-genai';

const GenerateWrittenContentInputSchema = z.object({
  title: z.string().describe('The main title of the article.'),
  description: z.string().optional().describe('A short description of the article to give context.'),
  keywords: z.string().optional().describe('A comma-separated list of keywords to focus on.'),
  language: z.string().describe('The language for the generated content (e.g., "English" or "Hindi").'),
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
  model: googleAI.model('gemini-1.5-flash'),
  input: {schema: GenerateWrittenContentInputSchema},
  output: {schema: GenerateWrittenContentOutputSchema},
  prompt: `You are an expert content creator and SEO specialist. Your task is to write an in-depth, well-researched article that is Google Discover friendly, based on the provided title, description, and keywords.

**Article Details:**
- **Title:** {{{title}}}
{{#if description}}
- **Description:** {{{description}}}
{{/if}}
{{#if keywords}}
- **Keywords:** {{{keywords}}}
{{/if}}

**Your Instructions are:**
1.  **Tone and Style:** Write in a conversational yet informative tone. The language should be simple Hindi with some English words (Hinglish), making it clear and accessible to a broad audience. The final article must feel like it was written by a human expert, not an AI. It must have a "human touch".
2.  **Length:** The article must be at least 1000 words.
3.  **Structure:**
    *   Start with two strong introductory paragraphs that include searchable keywords.
    *   Structure the rest of the article naturally with full headings (h2) and sub-headings (h3).
    *   Do not overuse bullet points. Use them only where it's important to list items.
    *   Include one table under a relevant heading to present data or comparisons.
    *   Ensure a logical flow with a strong conclusion.
4.  **Content:**
    *   Stick to the information related to the title, description, and keywords. Do not add external or unnecessary information.
    *   Your primary goal is to create an SEO-friendly article for a WordPress code editor.
5.  **Generated Assets (in the same language as the article - {{{language}}}):**
    *   **Titles:** Generate 10 alternative titles that are SEO-friendly and click-worthy, based on the main title.
    *   **Meta Description:** Create a compelling meta description.
    *   **Meta Tags:** Provide a list of up to 50 focus keywords for Rank Math, separated by commas.
    *   **Image Titles:** Create 8 SEO-friendly titles for images that could be used in the article. These titles should be related to the main topic and include relevant specifications if mentioned (e.g., RAM, ROM, camera, display for a phone review).

The entire output, including all generated assets, must be in the specified language: **{{{language}}}**.
`,
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
