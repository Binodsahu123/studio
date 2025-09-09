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


const defaultPromptTemplate = `You are an expert SEO content writer specializing in creating articles for Google Discover. Your task is to write an in-depth, well-researched, and engaging article of around 1000 WORDS in {{language}} on the topic: "{{title}}". Also generate all the required SEO assets.

**Article Content Guidelines:**
- **Topic:** {{{title}}}
- **Base Description:** {{{shortDescription}}}
- **Additional Keyword:** {{{additionalTopic}}}
- **Language:** {{language}}. If Hindi, use clear and accessible general Hindi.
- **Tone & Style:**
  - Write it like a human would. Use simple, conversational English. Avoid complex words and AI-like phrasing. The article should feel personal and authentic.
- **Readability is crucial.** Start with two introductory paragraphs that are highly engaging and include searchable keywords.
- The article must be fully SEO optimized. The main title "{{title}}" should appear naturally within the content.
- **Structure:**
  - The article MUST be in HTML format.
  - DO NOT include an <h1> tag or a main title inside the content itself. The content should start directly with the first section heading.
  - Use multiple catchy <h2> tags for main section headings and <h3> for sub-headings. All headings must be followed.
  - Use <p> for paragraphs and <strong> for important keywords.
  - DO NOT use bullet points excessively. Only use them where it is essential to list items.
  - Include one table (<table>) within one of the sections where it makes sense to present data.
- **Credibility (E-E-A-T):** Break down complex concepts into simple terms. Include relevant statistics, examples, or credible opinions to build trust and authority.
- **Engagement:** Keep sentences varied and engaging to maintain reader interest. The final article should feel like it was written by a human expert, not AI.

**SEO Asset Generation:**
Based on the generated article and the input title ("{{{title}}}"), create the following assets:

1.  **Titles:** Provide 10 SEO-friendly and click-worthy title options. These titles should be highly engaging and suitable for Google Discover.
2.  **Meta Description:** Create a compelling meta description (under 160 characters).
3.  **Meta Tags:** Provide a comma-separated string of up to 50 relevant focus keywords, suitable for the Rank Math SEO plugin.
4.  **Image Titles:** Create 8 SEO-friendly titles for images that would be used in the article. These titles should be relevant to the content and also include specifications from the input title.
`;

const GenerateWrittenContentInputSchema = z.object({
  title: z.string().describe('The main title or topic of the content. Include phone specifications here if applicable.'),
  shortDescription: z.string().optional().describe('A short description of the content.'),
  language: z.string().describe('The language for the generated content (e.g., "English" or "Hindi").'),
  additionalTopic: z.string().optional().describe('An additional topic or keyword to focus on.'),
  customPrompt: z.string().optional().describe('An optional custom prompt to override the default.'),
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

const generateWrittenContentFlow = ai.defineFlow(
  {
    name: 'generateWrittenContentFlow',
    inputSchema: GenerateWrittenContentInputSchema,
    outputSchema: GenerateWrittenContentOutputSchema,
  },
  async input => {

    const promptTemplate = input.customPrompt || defaultPromptTemplate;
    
    // Simple templating to replace placeholders
    let finalPrompt = promptTemplate
        .replace(/{{title}}/g, input.title)
        .replace(/{{{title}}}/g, input.title)
        .replace(/{{{shortDescription}}}/g, input.shortDescription || 'Not provided')
        .replace(/{{language}}/g, input.language)
        .replace(/{{{additionalTopic}}}/g, input.additionalTopic || 'Not provided');
    

    const aiprompt = ai.definePrompt({
      name: 'generateWrittenContentPrompt',
      output: {schema: GenerateWrittenContentOutputSchema},
      prompt: finalPrompt,
    });
    
    const {output} = await aiprompt();

    // Fallback for titles if the model doesn't generate them
    if (!output!.titles || output!.titles.length === 0) {
      output!.titles = [input.title];
    }
    return output!;
  }
);
