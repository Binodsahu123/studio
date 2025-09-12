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
  originalContent: z.string().describe('The original content to be enriched and formatted.'),
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
  input: {schema: GenerateWrittenContentInputSchema},
  output: {schema: GenerateWrittenContentOutputSchema},
  prompt: `Write an in-depth, well-researched article in google discover friendly on The article should be structured naturally, providing clear explanations, examples, and insights to help readers fully understand the topic. Use a conversational yet informative tone, making it engaging and easy to read. Ensure the content flows logically, with a proper introduction, detailed body sections, and a strong conclusion. Avoid robotic or generic writing; instead, write as an expert who deeply understands the subject. Use general hindi that is clear and accessible to a broad audience. Break down complex concepts into simple terms, and where necessary, include relevant statistics, case studies, or expert opinions to add credibility. Keep sentences varied and engaging to maintain reader interest. The final article should feel like it was written by a human expert, not Al  hindi aur halka english me bnao google discover friendly bnao ise human touch do jese human likhte hai saral hindi lanaguge mein ek bhi word ai se likha hua nahi lagna chahiye sab aesa hi lagna chaiye jese humne likha ho readability ka khaas dhyan rakhein or kam s kam 1000 words ka hona chaye jisme satrting mein pehle 2 paragraph hone chaye or usme saerchebale keyword add hone chaiye or phirr aage acha sa human jesa likhta hai aesa follow kro or zyada kahin bullents points ka use nhi hona chaiye bs ek do agah ho jahan important ho batana or table bhi rakhna kisi ek heading ke saath or kisi ki bhi heading change nhi honi chaiye sab same honi chaye follow kro or m hi likh kar do or  Is content se meta discription aur meta  tag bna aur title bhi do jismein Mera yah title Aaye. Meta tag rank math ke liye do Focus keyword maximum 50 Coma Laga ke do yaar, Main ismein aath image dalna chahta hun UN sabhi image ka title ISI content se uthakar bnao app mein क्या-क्या khas Hai ine sabhi baat ka Dhyan rakhte hue banana hai title ekadam SEO friendly Ho aur clickbait bhi ho Ye mera content hai "{{{originalContent}}}"Is content me full heading haff heading sub jodna ha aur jitna content diya hai utna hi jodna Hai Bahar ka kuchh bhi content nahin jodna Hai aur na hi jyada dimag lagane ki jarurat hai ismein Keval word press ke code editor ke liye SEO friendly bnao aur kahin Bahar ka content nahin jodna hai aur na hi kahin ISI content ko bus se friendly banana hai jitna Maine content Diya Hai Is content se meta description aur meta  tag bnao aur title bhi do jismein Mera yah title Aaye Jo seo फ्रेंडली और एकदम क्लिक वेट हो 10 टाइटल का ऑप्शन दो. Meta tag rank math ke liye do Focus keyword maximum 50 Coma Laga ke do yaar, Main ismein 8 image dalna chahta hun UN sabhi image ka title ISI content se uthakar bnao jo seo tittle se milta julta ho aur title mein phone ka jo jo specification ho vah sab aana chahie jaise ki RAM ROM camera display. The entire output must be in the language: {{{language}}}.`,
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
      // Create a fallback title from the first few words of the content
      const fallbackTitle = input.originalContent.split(' ').slice(0, 10).join(' ');
      output.titles = [fallbackTitle];
    }
    
    return output;
  }
);
