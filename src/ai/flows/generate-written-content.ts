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


// "Hidden" human-written text examples for different tones/styles
const styleExamples = {
  'tech-review': `Example of a Tech Review: "The first thing you notice about the new Pixel is its heft. It feels substantial, premium, without being overly heavy. The matte glass back is a godsend for fingerprint-phobes like me, and the polished aluminum frame provides just the right amount of grip. Powering it on, the 120Hz display is buttery smooth, and colors just pop. Setting it up was a breeze, as expected from a Google device. I'm particularly interested in testing the new camera's low-light capabilities, which Google claims has been massively improved. Let's see if it lives up to the hype."`,
  'news-report': `Example of a News Report: "Local authorities have issued a city-wide alert following a major water main break in the downtown core early this morning. The incident, which occurred at approximately 5:30 AM near the intersection of Main and Market streets, has caused significant flooding and traffic disruptions. Emergency crews are on the scene, and officials are advising commuters to seek alternate routes. The cause of the break is still under investigation, with early reports suggesting aging infrastructure may be a contributing factor. Updates will be provided as they become available."`,
  'casual-blog-post': `Example of a Casual Blog Post: "Okay, so I tried the viral 'cloud bread' recipe this weekend, and I have THOUGHTS. First off, it was way easier to make than I expected. Seriously, just three ingredients! The texture is super weird but in a good way? It's like a fluffy, eggy meringue-biscuit hybrid. It's not going to replace my sourdough obsession anytime soon, but for a fun, low-carb sandwich option, I'm totally on board. Let me know in the comments if you've tried it and what you think!"`,
};
type ToneCategory = keyof typeof styleExamples;


const defaultPromptTemplate = `You are an expert SEO content writer specializing in creating articles for Google Discover. Your task is to write an in-depth, well-researched, and engaging article of around 1000 WORDS in {{language}} on the topic: "{{title}}". Also generate all the required SEO assets.

**Tone & Style Instructions:**
{{#if styleExample}}
Analyze the following text example and adopt its tone, voice, and style for the article you are about to write. Match the complexity, sentence structure, and overall feel of the example.
---
EXAMPLE:
{{{styleExample}}}
---
{{else}}
Write it like a human would. Use simple, conversational English. Avoid complex words and AI-like phrasing. The article should feel personal and authentic.
{{/if}}


**Article Content Guidelines:**
- **Topic:** {{{title}}}
- **Base Description:** {{{shortDescription}}}
- **Additional Keyword:** {{{additionalTopic}}}
- **Language:** {{language}}. If Hindi, use clear and accessible general Hindi.
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
  toneCategory: z.string().optional().describe('The category of tone and style to adopt, based on hidden examples.'),
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
    
    // Get the style example based on the category from the input
    const styleExample = input.toneCategory ? styleExamples[input.toneCategory as ToneCategory] : '';

    // Simple templating to replace placeholders
    let finalPrompt = promptTemplate
        .replace(/{{title}}/g, input.title)
        .replace(/{{{title}}}/g, input.title)
        .replace(/{{{shortDescription}}}/g, input.shortDescription || 'Not provided')
        .replace(/{{language}}/g, input.language)
        .replace(/{{{additionalTopic}}}/g, input.additionalTopic || 'Not provided');
    
    // Handle the conditional styleExample block
    if (styleExample) {
        finalPrompt = finalPrompt
            .replace('{{#if styleExample}}', '')
            .replace('{{{styleExample}}}', styleExample)
            .replace('{{/if}}', '');
    } else {
        // Remove the whole block if no styleExample is present
        finalPrompt = finalPrompt.replace(/{{#if styleExample}}[\s\S]*?{{/if}}/g, '');
    }


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
