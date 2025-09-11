'use server';
/**
 * @fileOverview A flow to rewrite existing text content based on specific instructions.
 *
 * - rewriteContent - A function that rewrites text.
 * - RewriteContentInput - The input type for the function.
 * - RewriteContentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Example texts for different tones
const toneExamples = {
    'Casual Blog Post': `Today, I finally got my hands on the new "Chrono-Lander" smartwatch, and I'm buzzing! First off, the unboxing experience was a treat. The packaging is super sleek. Setting it up was a breeze—just a few taps and it was synced with my phone. The screen is gorgeous, and the strap feels really comfy. I took it for a spin on my evening run, and the GPS tracking was spot on. Honestly, I'm already impressed. Can't wait to see what else this thing can do over the next few days!`,
    'Professional Email': `Dear Team,\n\nI hope this email finds you well.\n\nFollowing up on our discussion from the Q3 planning meeting, I have attached the finalized project roadmap for your review. Please take a moment to look over the key deliverables and timelines outlined within the document.\n\nYour feedback is highly valuable. Kindly provide any comments or suggestions by end of business on Friday, October 28th, so we can move forward with the next phase.\n\nThank you for your cooperation.\n\nBest regards,\nAlex Chen\nProject Manager`,
    'News Report': `New data released by the National Statistics Bureau today reveals a significant shift in consumer spending habits over the past fiscal quarter. The report indicates a 15% decrease in spending on non-essential goods, while the services sector saw a surprising 8% surge. Economists suggest these figures reflect growing market uncertainty and a reprioritization of household budgets. The government is expected to issue a formal statement later this week in response to these findings.`,
    'Smartphone Review': `Vivo V29 5G कंपनी का एक प्रीमियम स्मार्टफोन है जो शानदार डिज़ाइन और बेहतरीन कैमरा क्वालिटी के लिए जाना जाता है। यह फोन खासतौर पर उन यूज़र्स के लिए है जो स्टाइलिश लुक के साथ-साथ मजबूत परफॉर्मेंस और 5G कनेक्टिविटी चाहते हैं।

डिज़ाइन
Vivo V29 5G का डिज़ाइन बहुत ही स्लिम और प्रीमियम है। इसमें कर्व्ड डिस्प्ले दी गई है जो फोन को और भी आकर्षक बनाती है। पीछे की तरफ ग्लास फिनिश के साथ एलिगेंट कैमरा मॉड्यूल दिया गया है। फोन हल्का और हाथ में पकड़ने में आरामदायक है।

डिस्प्ले
इसमें 6.78 इंच की AMOLED 3D कर्व्ड डिस्प्ले दी गई है, जो 120Hz रिफ्रेश रेट और FHD+ रेज़ॉल्यूशन के साथ आती है। इसकी डिस्प्ले बहुत ही स्मूद और ब्राइट है, जिससे वीडियो देखने, गेमिंग और स्क्रॉलिंग का अनुभव बेहतरीन हो जाता है।

कैमरा
Vivo V29 5G का सबसे बड़ा आकर्षण इसका कैमरा सेटअप है। इसमें 50MP OIS प्राइमरी कैमरा, 8MP अल्ट्रा-वाइड और 2MP डेप्थ सेंसर दिया गया है। वहीं, सेल्फी और वीडियो कॉलिंग के लिए 50MP का हाई-रेज़ॉल्यूशन फ्रंट कैमरा मौजूद है। लो-लाइट फोटोग्राफी और पोर्ट्रेट शॉट्स में यह कैमरा शानदार रिजल्ट देता है।

परफॉर्मेंस
यह स्मार्टफोन Qualcomm Snapdragon 778G प्रोसेसर पर चलता है, जो 5G सपोर्ट करता है और स्मूद परफॉर्मेंस देता है। इसमें 8GB/12GB RAM और 128GB/256GB स्टोरेज ऑप्शन उपलब्ध हैं। मल्टीटास्किंग, गेमिंग और हैवी ऐप्स चलाने में फोन बेहद तेज़ और लैग-फ्री परफॉर्मेंस देता है।

बैटरी और चार्जिंग
Vivo V29 5G में 4600mAh की बैटरी दी गई है, जो 80W फास्ट चार्जिंग को सपोर्ट करती है। कंपनी का दावा है कि यह फोन कुछ ही मिनटों में काफी हद तक चार्ज हो जाता है, जिससे यूज़र्स को बैटरी बैकअप को लेकर कोई परेशानी नहीं होती।

दमदार फीचर्स और स्टाइलिश डिजाइन वाला स्मार्टफोन। खरीदे मात्र 13,999 में

सॉफ्टवेयर
यह स्मार्टफोन Android 13 पर आधारित Funtouch OS के साथ आता है, जिसमें कई कस्टम फीचर्स और पर्सनलाइजेशन ऑप्शन मिलते हैं।

कीमत
Vivo V29 5G की कीमत भारतीय मार्केट में लगभग ₹32,999 से ₹36,999 के बीच रखी गई है, जो इसके वेरिएंट और स्टोरेज पर निर्भर करती है.`
};

const RewriteContentInputSchema = z.object({
  originalText: z
    .string()
    .describe('The original text content to be rewritten.'),
  toneCategory: z
    .enum(Object.keys(toneExamples) as [string, ...string[]])
    .describe(
      'The desired tone and style for the rewritten text, based on predefined categories.'
    ),
  language: z
    .string()
    .describe('The target language for the rewritten content.'),
});
export type RewriteContentInput = z.infer<typeof RewriteContentInputSchema>;

const RewriteContentOutputSchema = z.object({
  rewrittenText: z
    .string()
    .describe('The rewritten content, formatted in HTML.'),
});
export type RewriteContentOutput = z.infer<typeof RewriteContentOutputSchema>;

export async function rewriteContent(
  input: RewriteContentInput
): Promise<RewriteContentOutput> {
  // Select the example text based on the chosen category
  const exampleText = toneExamples[input.toneCategory];
  return rewriteContentFlow({...input, exampleText});
}

const RewriteFlowInputSchema = RewriteContentInputSchema.extend({
    exampleText: z.string()
});

const prompt = ai.definePrompt({
  name: 'rewriteContentPrompt',
  input: {schema: RewriteFlowInputSchema},
  output: {schema: RewriteContentOutputSchema},
  prompt: `You are an expert content editor, behaving like the DeepSeek AI model. Your task is to rewrite the "Original Text" to match the tone and style of the "Example Text". The final output must be in the specified "Language" and formatted as clean HTML.

**Language for the output:** {{{language}}}

**Example Text (This defines the tone and style you must adopt):**
\`\`\`
{{{exampleText}}}
\`\`\`

**Original Text (Rewrite this text):**
\`\`\`
{{{originalText}}}
\`\`\`

Please now provide the rewritten text below, fully adopting the style, tone, and sentence structure of the example. Use appropriate HTML tags like <p>, <strong>, and <ul> where necessary.`,
});

const rewriteContentFlow = ai.defineFlow(
  {
    name: 'rewriteContentFlow',
    inputSchema: RewriteFlowInputSchema,
    outputSchema: RewriteContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
