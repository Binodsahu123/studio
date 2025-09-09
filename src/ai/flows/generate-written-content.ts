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

const toneExamples = {
  'Tech Review': `
Example Article: Samsung Galaxy S24 Ultra - A Small Step for Samsung, A Giant Leap for AI

For years, the smartphone race was about hardware: better cameras, faster chips, brighter screens. But with the Samsung Galaxy S24 Ultra, it's clear the new battleground is Artificial Intelligence. At first glance, the S24 Ultra looks deceptively similar to its predecessor. It has the same massive 6.8-inch display, a familiar quad-camera setup, and the signature built-in S-Pen. But turn it on, and you'll find AI woven into almost every corner of the experience.

The headline feature is "Circle to Search," a collaboration with Google that feels like magic. Simply circle anything on your screen – a landmark in a photo, a pair of shoes on a website – and Google will instantly search for it. It's fast, intuitive, and genuinely useful. Then there's the AI-powered photo editing. You can move people around in photos, erase unwanted objects, and even expand the background of an image, with the AI filling in the gaps. It's not always perfect, but when it works, it's mind-blowing.

For productivity, the AI can summarize long notes into bullet points, format your messy handwriting into clean text, and even translate phone calls in real-time. While some of these features feel more like a "beta" than a finished product, they show a clear vision for the future: a phone that doesn't just respond to your commands but anticipates your needs. The hardware, as always, is top-notch. The new Snapdragon 8 Gen 3 for Galaxy chip is a powerhouse, and the flat display with its anti-reflective coating is a joy to use. The camera, while largely unchanged, still produces stunning photos.

Is the S24 Ultra a must-have upgrade for S23 Ultra owners? Maybe not. The core experience is similar. But if you're coming from an older device or are excited by the promise of on-device AI, the S24 Ultra is the most capable, feature-packed, and forward-thinking Android phone on the market today. It's not just a smartphone; it's a smart AI phone.
`,
  'Casual Blog Post': `
Example Article: Why I Traded My Morning Coffee for a 10-Minute Walk

I used to be a coffee person. The kind of person who couldn't form a coherent sentence before my first cup. My morning ritual was a sacred dance between the coffee maker, my favorite mug, and the splash of oat milk. But a few months ago, I decided to try something radical. I replaced my morning coffee with a simple 10-minute walk around my neighborhood. And honestly? It changed everything.

The first few days were rough. I had headaches. I was grumpy. I missed the taste and the warmth. But I stuck with it, and by the end of the first week, I started to notice a change. Instead of the jittery, anxious energy coffee sometimes gave me, I felt a calm, sustained sense of alertness. The gentle morning light, the fresh air, and the simple act of moving my body seemed to wake up my brain in a more natural way.

I started noticing little things on my walks: a new flower blooming in a neighbor's garden, the funny way a squirrel would dash across the power line, the friendly wave from the elderly man who also walks his dog every morning. It became a form of mindfulness, a way to connect with my surroundings before diving into the digital chaos of the workday.

I'm not saying I've given up coffee for good. I still enjoy a good latte on a weekend afternoon. But that frantic, desperate need for it in the morning is gone. That 10-minute walk gives me more than caffeine ever could: clarity, a sense of peace, and a better connection to the world around me. If you're feeling stuck in a rut, maybe give it a try. You might be surprised at what you find.
`,
  'News Report': `
Example Article: Local Community Rallies to Save Historic Downtown Theater

CENTRAL CITY – A beacon of culture and history in Central City, the Grand Palace Theater, faced with permanent closure, has been given a new lease on life thanks to an unprecedented community-led effort. The "Save the Palace" campaign, which launched just three months ago, announced today that it has successfully raised over $1.5 million, exceeding its goal to purchase and begin renovations on the 98-year-old landmark.

The campaign was a grassroots movement, fueled by bake sales, online fundraisers, and significant contributions from local businesses. "This theater is the heart of our city," said campaign organizer and longtime resident, Maria Flores. "It's where our grandparents had their first dates and where our children saw their first movies. We couldn't let it become another parking lot."

The Grand Palace Theater, which opened in 1926, has been closed since the start of the pandemic and fell into disrepair. The current owners had planned to sell the property to a commercial developer before the community group intervened. The funds raised will cover the acquisition of the building and the first phase of essential repairs, including a new roof and updated electrical systems.

Mayor John Davis praised the initiative at a press conference this morning. "What this community has achieved is nothing short of remarkable," he stated. "It's a testament to the power of citizen engagement and a shared love for our city's history." The campaign's next phase will focus on restoring the theater's ornate interior, with a grand reopening tentatively scheduled for late next year. The group plans to operate the theater as a non-profit, hosting a mix of classic films, live music, and community events.
`,
};

const GenerateWrittenContentInputSchema = z.object({
  title: z.string().describe('The main title or topic of the content. Include phone specifications here if applicable.'),
  shortDescription: z.string().optional().describe('A short description of the content.'),
  language: z.string().describe('The language for the generated content (e.g., "English" or "Hindi").'),
  additionalTopic: z.string().optional().describe('An additional topic or keyword to focus on.'),
  toneCategory: z.string().optional().describe("The category of tone to use, which determines the example text."),
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

    const exampleText = toneExamples[input.toneCategory as keyof typeof toneExamples] || 'No example provided.';
    
    const promptTemplate = `You are an expert SEO content writer. Your primary task is to write an in-depth, engaging article of AT LEAST 1000 WORDS in {{language}} on the topic: "{{title}}".

**MOST IMPORTANT INSTRUCTION:** You must write in the EXACT same tone, style, sentence structure, and voice as the example article provided below. Analyze the example carefully and replicate its style for the new topic.

**Example Article (Your Style Guide):**
---
{{{exampleText}}}
---

**New Article Details:**
- **Topic:** {{{title}}}
- **Base Description:** {{{shortDescription}}}
- **Additional Keyword:** {{{additionalTopic}}}
- **Language:** {{language}}. If Hindi, use clear and accessible general Hindi.

**Content & Structure Guidelines (Apply these using the example's style):**
- The new article MUST be in HTML format.
- DO NOT include an <h1> tag. Start directly with the first <h2> heading.
- Use multiple catchy <h2> and <h3> tags.
- Use <p> for paragraphs and <strong> for important keywords.
- Use tables (<table>) or lists (<ul>) only if the style is present in the example or makes sense for the topic.
- The content must be fully SEO optimized, with the main title "{{title}}" appearing naturally.

**SEO Asset Generation (Based on the NEW article):**
After writing the new article, create the following assets for it:
1.  **Titles:** Provide 10 SEO-friendly and click-worthy title options.
2.  **Meta Description:** Create a compelling meta description (under 160 characters).
3.  **Meta Tags:** Provide a comma-separated string of up to 50 relevant focus keywords.
4.  **Image Titles:** Create 8 SEO-friendly titles for images relevant to the new article.
`;

    // Simple templating to replace placeholders
    let finalPrompt = promptTemplate
        .replace(/{{title}}/g, input.title)
        .replace(/{{{title}}}/g, input.title)
        .replace(/{{{shortDescription}}}/g, input.shortDescription || 'Not provided')
        .replace(/{{language}}/g, input.language)
        .replace(/{{{additionalTopic}}}/g, input.additionalTopic || 'Not provided')
        .replace(/{{{exampleText}}}/g, exampleText);
    

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
