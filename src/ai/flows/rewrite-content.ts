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
  'Casual Blog Post': {
    English: `Today, I finally got my hands on the new "Chrono-Lander" smartwatch, and I'm buzzing! First off, the unboxing experience was a treat. The packaging is super sleek. Setting it up was a breeze—just a few taps and it was synced with my phone. The screen is gorgeous, and the strap feels really comfy. I took it for a spin on my evening run, and the GPS tracking was spot on. Honestly, I'm already impressed. Can't wait to see what else this thing can do over the next few days!`,
    Hindi: `आज मैंने आखिरकार नई "क्रोनो-लैंडर" स्मार्टवॉच ले ही ली, और मैं बहुत उत्साहित हूँ! सबसे पहले, अनबॉक्सिंग का अनुभव बहुत बढ़िया था। पैकेजिंग सुपर स्लीक है। इसे सेट अप करना बहुत आसान था—बस कुछ टैप्स और यह मेरे फोन के साथ सिंक हो गई। स्क्रीन बहुत खूबसूरत है, और स्ट्रैप बहुत आरामदायक लगता है। मैंने इसे अपनी शाम की दौड़ में इस्तेमाल किया, और जीपीएस ट्रैकिंग एकदम सही थी। सच कहूँ तो, मैं पहले से ही बहुत प्रभावित हूँ। अगले कुछ दिनों में यह और क्या-क्या कर सकती है, यह देखने के लिए मैं इंतजार नहीं कर सकता!`,
  },
  'Professional Email': {
    English: `Dear Team,\n\nI hope this email finds you well.\n\nFollowing up on our discussion from the Q3 planning meeting, I have attached the finalized project roadmap for your review. Please take a moment to look over the key deliverables and timelines outlined within the document.\n\nYour feedback is highly valuable. Kindly provide any comments or suggestions by end of business on Friday, October 28th, so we can move forward with the next phase.\n\nThank you for your cooperation.\n\nBest regards,\nAlex Chen\nProject Manager`,
    Hindi: `प्रिय टीम,\n\nमुझे उम्मीद है कि आप सब ठीक होंगे।\n\nQ3 योजना बैठक में हमारी चर्चा के बाद, मैंने आपकी समीक्षा के लिए अंतिम प्रोजेक्ट रोडमैप संलग्न कर दिया है। कृपया दस्तावेज़ में उल्लिखित प्रमुख डिलिवरेबल्स और समय-सीमाओं पर एक नज़र डालें।\n\nआपकी प्रतिक्रिया बहुत मूल्यवान है। कृपया शुक्रवार, 28 अक्टूबर तक कोई भी टिप्पणी या सुझाव प्रदान करें, ताकि हम अगले चरण के साथ आगे बढ़ सकें।\n\nआपके सहयोग के लिए धन्यवाद।\n\nसाभार,\nएलेक्स चेन\nपरियोजना प्रबंधक`,
  },
  'News Report': {
    English: `New data released by the National Statistics Bureau today reveals a significant shift in consumer spending habits over the past fiscal quarter. The report indicates a 15% decrease in spending on non-essential goods, while the services sector saw a surprising 8% surge. Economists suggest these figures reflect growing market uncertainty and a reprioritization of household budgets. The government is expected to issue a formal statement later this week in response to these findings.`,
    Hindi: `राष्ट्रीय सांख्यिकी ब्यूरो द्वारा आज जारी किए गए नए आंकड़ों से पता चलता है कि पिछली वित्तीय तिमाही में उपभोक्ता खर्च की आदतों में एक महत्वपूर्ण बदलाव आया है। रिपोर्ट गैर-आवश्यक वस्तुओं पर खर्च में 15% की कमी का संकेत देती है, जबकि सेवा क्षेत्र में आश्चर्यजनक रूप से 8% की वृद्धि देखी गई है। अर्थशास्त्रियों का सुझाव है कि ये आंकड़े बढ़ते बाजार अनिश्चितता और घरेलू बजट के पुनर्मूल्यांकन को दर्शाते हैं। सरकार से इस सप्ताह के अंत में इन निष्कर्षों के जवाब में एक औपचारिक बयान जारी करने की उम्मीद है।`,
  },
  'Smartphone Review': {
    English: `The Vivo V29 5G is a premium smartphone from the company, known for its stunning design and excellent camera quality. This phone is especially for users who want strong performance and 5G connectivity along with a stylish look.\n\nDesign\nThe design of the Vivo V29 5G is very slim and premium. It features a curved display that makes the phone even more attractive. The back has a glass finish with an elegant camera module. The phone is lightweight and comfortable to hold.\n\nDisplay\nIt sports a 6.78-inch AMOLED 3D curved display with a 120Hz refresh rate and FHD+ resolution. Its display is very smooth and bright, making the experience of watching videos, gaming, and scrolling excellent.\n\nCamera\nThe biggest highlight of the Vivo V29 5G is its camera setup. It features a 50MP OIS primary camera, an 8MP ultra-wide, and a 2MP depth sensor. For selfies and video calling, there is a 50MP high-resolution front camera. This camera delivers fantastic results in low-light photography and portrait shots.\n\nPerformance\nThis smartphone runs on the Qualcomm Snapdragon 778G processor, which supports 5G and provides smooth performance. It is available in 8GB/12GB RAM and 128GB/256GB storage options. The phone is extremely fast and lag-free for multitasking, gaming, and running heavy apps.\n\nBattery and Charging\nThe Vivo V29 5G is equipped with a 4600mAh battery that supports 80W fast charging. The company claims that the phone can be charged significantly in just a few minutes, so users don't have to worry about battery backup.\n\nSoftware\nThis smartphone comes with Funtouch OS based on Android 13, which offers many custom features and personalization options.\n\nPrice\nThe price of the Vivo V29 5G in the Indian market is approximately between ₹32,999 and ₹36,999, depending on its variant and storage.`,
    Hindi: `Vivo V29 5G कंपनी का एक प्रीमियम स्मार्टफोन है जो शानदार डिज़ाइन और बेहतरीन कैमरा क्वालिटी के लिए जाना जाता है। यह फोन खासतौर पर उन यूज़र्स के लिए है जो स्टाइलिश लुक के साथ-साथ मजबूत परफॉर्मेंस और 5G कनेक्टिविटी चाहते हैं।\n\nडिज़ाइन\nVivo V29 5G का डिज़ाइन बहुत ही स्लिम और प्रीमियम है। इसमें कर्व्ड डिस्प्ले दी गई है जो फोन को और भी आकर्षक बनाती है। पीछे की तरफ ग्लास फिनिश के साथ एलिगेंट कैमरा मॉड्यूल दिया गया है। फोन हल्का और हाथ में पकड़ने में आरामदायक है।\n\nडिस्प्ले\nइसमें 6.78 इंच की AMOLED 3D कर्व्ड डिस्प्ले दी गई है, जो 120Hz रिफ्रेश रेट और FHD+ रेज़ॉल्यूशन के साथ आती है। इसकी डिस्प्ले बहुत ही स्मूद और ब्राइट है, जिससे वीडियो देखने, गेमिंग और स्क्रॉलिंग का अनुभव बेहतरीन हो जाता है।\n\nकैमरा\nVivo V29 5G का सबसे बड़ा आकर्षण इसका कैमरा सेटअप है। इसमें 50MP OIS प्राइमरी कैमरा, 8MP अल्ट्रा-वाइड और 2MP डेप्थ सेंसर दिया गया है। वहीं, सेल्फी और वीडियो कॉलिंग के लिए 50MP का हाई-रेज़ॉल्यूशन फ्रंट कैमरा मौजूद है। लो-लाइट फोटोग्राफी और पोर्ट्रेट शॉट्स में यह कैमरा शानदार रिजल्ट देता है।\n\nपरफॉर्मेंस\nयह स्मार्टफोन Qualcomm Snapdragon 778G प्रोसेसर पर चलता है, जो 5G सपोर्ट करता है और स्मूद परफॉर्मेंस देता है। इसमें 8GB/12GB RAM और 128GB/256GB स्टोरेज ऑप्शन उपलब्ध हैं। मल्टीटास्किंग, गेमिंग और हैवी ऐप्स चलाने में फोन बेहद तेज़ और लैग-फ्री परफॉर्मेंस देता है।\n\nबैटरी और चार्जिंग\nVivo V29 5G में 4600mAh की बैटरी दी गई है, जो 80W फास्ट चार्जिंग को सपोर्ट करती है। कंपनी का दावा है कि यह फोन कुछ ही मिनटों में काफी हद तक चार्ज हो जाता है, जिससे यूज़र्स को बैटरी बैकअप को लेकर कोई परेशानी नहीं होती।\n\nदमदार फीचर्स और स्टाइलिश डिजाइन वाला स्मार्टफोन। खरीदे मात्र 13,999 में\n\nसॉफ्टवेयर\nयह स्मार्टफोन Android 13 पर आधारित Funtouch OS के साथ आता है, जिसमें कई कस्टम फीचर्स और पर्सनलाइजेशन ऑप्शन मिलते हैं।\n\nकीमत\nVivo V29 5G की कीमत भारतीय मार्केट में लगभग ₹32,999 से ₹36,999 के बीच रखी गई है, जो इसके वेरिएंट और स्टोरेज पर निर्भर करती है.`
  }
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
    .enum(['English', 'Hindi'])
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
  // Select the example text based on the chosen category and language
  const exampleText = toneExamples[input.toneCategory][input.language];
  return rewriteContentFlow({...input, exampleText});
}

const RewriteFlowInputSchema = RewriteContentInputSchema.extend({
    exampleText: z.string()
});

const prompt = ai.definePrompt({
  name: 'rewriteContentPrompt',
  input: {schema: RewriteFlowInputSchema},
  output: {schema: RewriteContentOutputSchema},
  prompt: `You are an expert content editor. Your task is to rewrite the "Original Text" to match the tone and style of the "Example Text". The final output must be in the specified "Language" and formatted as clean HTML.

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
