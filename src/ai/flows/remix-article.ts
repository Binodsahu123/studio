'use server';
/**
 * @fileOverview A flow to remix multiple source articles into a single new one, matching a specific tone and style from a reference article.
 *
 * - remixArticle - A function that remixes articles.
 * - getToneExamples - A function that returns the pre-defined tone examples.
 * - RemixArticleInput - The input type for the function.
 * - RemixArticleOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const toneExamples: Record<string, string> = {
  'Casual Blog Post': `Today, I finally got my hands on the new "Chrono-Lander" smartwatch, and I'm buzzing! First off, the unboxing experience was a treat. The packaging is super sleek. Setting it up was a breeze—just a few taps and it was synced with my phone. The screen is gorgeous, and the strap feels really comfy. I took it for a spin on my evening run, and the GPS tracking was spot on. Honestly, I'm already impressed. Can't wait to see what else this thing can do over the next few days!`,
  'News Report': `New data released by the National Statistics Bureau today reveals a significant shift in consumer spending habits over the past fiscal quarter. The report indicates a 15% decrease in spending on non-essential goods, while the services sector saw a surprising 8% surge. Economists suggest these figures reflect growing market uncertainty and a reprioritization of household budgets. The government is expected to issue a formal statement later this week in response to these findings.`,
  'Smartphone Review': `The Vivo V29 5G is a premium smartphone from the company, known for its stunning design and excellent camera quality. This phone is especially for users who want strong performance and 5G connectivity along with a stylish look. It sports a 6.78-inch AMOLED 3D curved display with a 120Hz refresh rate and FHD+ resolution. Its display is very smooth and bright, making the experience of watching videos, gaming, and scrolling excellent. The biggest highlight of the Vivo V29 5G is its camera setup. It features a 50MP OIS primary camera, an 8MP ultra-wide, and a 2MP depth sensor.`,
  'Sports': `The final whistle blew, and the stadium erupted. Manchester United has secured a dramatic 2-1 victory over Liverpool in a nail-biting encounter at Old Trafford. The match, filled with end-to-end action, saw Marcus Rashford score a stunning winner in the 88th minute, sending the home fans into delirium. Liverpool's defense, which had been solid for most of the game, was finally breached by a moment of individual brilliance.`,
  'Politics': `The Parliament session concluded today after a week of heated debates on the new infrastructure bill. The opposition raised significant concerns regarding the bill's financial implications and environmental impact. The ruling party, however, maintained that the legislation is crucial for national economic growth and modernization. The bill is now set to be presented in the upper house for further deliberation next month.`,
  'Technology': `मार्केट में आया सबसे सस्ता Vivo का प्रीमियम स्मार्टफोन, 12GB RAM के साथ मिलेगा 64MP धाकड़ कैमरा

Vivo V40e एक स्टाइलिश और पावरफुल 5G स्मार्टफोन है जिसे खासतौर पर उन यूज़र्स के लिए डिजाइन किया गया है जो बेहतर डिस्प्ले, शानदार कैमरा और लंबी बैटरी लाइफ की तलाश में रहते हैं।

Vivo V40e
इसका मॉडर्न डिजाइन और स्लिम बॉडी इसे प्रीमियम फील देते हैं। यह फोन गेमिंग, मल्टीटास्किंग और एंटरटेनमेंट सभी जरूरतों को पूरा करने में सक्षम है। Vivo का यह मॉडल अपनी कीमत में फ्लैगशिप जैसी परफॉर्मेंस देने का वादा करता है।

Vivo V40e Features
Design – फोन का डिजाइन काफी आकर्षक और स्लिम है। इसमें ग्लास फिनिश और कर्व्ड बॉडी दी गई है जो इसे पकड़ने में आरामदायक बनाती है। कलर ऑप्शंस भी प्रीमियम लुक को और खास बनाते हैं।

Display – Vivo V40e में 6.7 इंच का AMOLED डिस्प्ले मिलता है जो 120Hz रिफ्रेश रेट सपोर्ट करता है। हाई ब्राइटनेस और HDR सपोर्ट के कारण वीडियो और गेमिंग का अनुभव बेहद स्मूद और डिटेल्ड बनता है।

Camera – इसमें 64MP का प्राइमरी कैमरा, अल्ट्रा-वाइड और डेप्थ सेंसर के साथ दिया गया है। AI फीचर्स और नाइट मोड कम रोशनी में भी शानदार तस्वीरें कैप्चर करते हैं। फ्रंट कैमरा हाई-रेज़ॉल्यूशन सेल्फी और वीडियो कॉलिंग के लिए बेहतरीन है।

Battery – फोन में 5000mAh की बैटरी दी गई है। यह फास्ट चार्जिंग सपोर्ट करती है जिससे बैटरी कुछ ही समय में चार्ज हो जाती है। एक बार चार्ज करने पर यह पूरे दिन का बैकअप आसानी से दे देती है।

RAM & ROM – Vivo V40e में 8GB और 12GB RAM के विकल्प मिलते हैं। स्टोरेज के लिए 128GB और 256GB के वेरिएंट उपलब्ध हैं। यह कॉम्बिनेशन मल्टीटास्किंग और बड़े डेटा स्टोर करने के लिए परफेक्ट है।

Performance – Vivo V40e परफॉर्मेंस के मामले में स्मूद और फास्ट है। चाहे गेमिंग हो, मल्टीटास्किंग हो या हाई-ग्राफिक्स एप्स का इस्तेमाल, यह फोन बिना किसी लैग के सब संभाल लेता है।

Features – इसमें सिक्योरिटी के लिए इन-डिस्प्ले फिंगरप्रिंट सेंसर और फेस अनलॉक मौजूद हैं। कनेक्टिविटी के लिए 5G, ब्लूटूथ और वाई-फाई सपोर्ट मिलता है। डॉल्बी ऑडियो क्वालिटी म्यूज़िक और मूवी एक्सपीरियंस को और बेहतर बनाती है।

Vivo V40e Price
भारत में Vivo V40e की शुरुआती कीमत लगभग ₹28,999 हो सकती है। यह कीमत इसके RAM और स्टोरेज वेरिएंट पर निर्भर करेगी। कंपनी EMI विकल्प भी उपलब्ध कराएगी।

जहां यूज़र्स लगभग ₹2,000–₹2,400 की मासिक किस्त पर इसे खरीद सकते हैं। आकर्षक डिजाइन, दमदार कैमरा और पावरफुल परफॉर्मेंस के साथ Vivo V40e उन यूज़र्स के लिए शानदार विकल्प है जो मिड-रेंज बजट में प्रीमियम अनुभव चाहते हैं`,
  'Law': `In a landmark judgment, the Supreme Court has ruled that the right to privacy is a fundamental right under Article 21 of the Constitution. The verdict, delivered by a nine-judge bench, overrules previous judgments on the matter. Legal experts believe this decision will have wide-ranging implications for data protection laws and individual freedoms in the digital age. The ruling emphasizes the intrinsic value of privacy and its importance for human dignity.`,
  'Government': `The Ministry of Health and Family Welfare has announced the rollout of the second phase of its nationwide vaccination drive, starting August 1st. This phase will target individuals between the ages of 18 and 44. Citizens can register through the official government portal. The ministry has assured that adequate vaccine stocks have been allocated to all states to ensure a smooth and efficient process.`,
  'Games': `Developer 'PixelHeart Studios' has just dropped the gameplay trailer for their highly anticipated open-world RPG, "Chronicles of Aethel." The trailer showcases the game's breathtaking visuals, dynamic combat system, and a sprawling world filled with mythical creatures. Fans are particularly excited about the non-linear storyline, which promises a unique experience for every player. The game is slated for a Q4 2024 release.`,
  'Jobs': `As companies increasingly adopt remote work policies, the demand for roles in cybersecurity, cloud computing, and data analytics has skyrocketed. A recent report by LinkedIn indicates that "Data Scientist" and "AI Specialist" are among the fastest-growing job titles globally. To remain competitive, professionals are encouraged to upskill in these high-demand areas. The report also highlights the growing importance of soft skills like communication and adaptability in the modern workplace.`,
  'Education': `The new National Education Policy emphasizes a shift from rote learning to a more holistic, inquiry-based approach. It introduces a 5+3+3+4 school curriculum structure, replacing the traditional 10+2 system. A key focus is the integration of vocational training from the 6th grade, aiming to equip students with practical skills. The policy also aims to increase the Gross Enrolment Ratio in higher education to 50% by 2035.`,
  'Business': `Reliance Industries Limited (RIL) announced its quarterly earnings today, posting a record-breaking net profit of ₹18,549 crore, a 15% year-on-year increase. The growth was primarily driven by strong performance in its retail and telecom ventures. The company's stock surged by 3% following the announcement. Analysts suggest that RIL's diversified portfolio continues to be a key factor in its sustained financial success.`,
  'Finance': `The Reserve Bank of India (RBI) has kept the repo rate unchanged at 6.5% for the sixth consecutive time, citing persistent inflationary pressures. The decision by the Monetary Policy Committee (MPC) was unanimous. The central bank has maintained its GDP growth forecast for the fiscal year at 7%, but remains cautious about the inflation outlook, which is projected to average 5.4% for the year.`,
  'Entertainment': `The trailer for the much-anticipated sci-fi epic "Nexus Point" has finally dropped, and it's already breaking the internet. Directed by visionary filmmaker Anya Sharma, the film stars superstar Vikram Rao in a role that promises to be a visual spectacle. Fans are praising the stunning visual effects and intriguing plot. "Nexus Point" is set to hit theaters worldwide this December, and is expected to be a major box office hit.`,
  'Autos/Vehicles': `Tata Motors has launched the all-new Safari EV, marking its entry into the electric SUV segment. The Safari EV boasts an impressive claimed range of 500 km on a single charge and comes packed with features like a panoramic sunroof, a 12.3-inch touchscreen, and advanced driver-assistance systems (ADAS). Bookings are now open, with introductory prices starting at ₹25 lakh (ex-showroom).`,
};

const RemixArticleInputSchema = z.object({
  sourceArticles: z
    .string()
    .describe('The combined text content from multiple source articles to be remixed.'),
  toneReferenceArticle: z.string().describe('A sample article whose tone, style, and voice should be matched.'),
});
export type RemixArticleInput = z.infer<typeof RemixArticleInputSchema>;

const RemixArticleOutputSchema = z.object({
  remixedArticleHtml: z
    .string()
    .describe('The newly generated article, formatted in SEO-friendly HTML.'),
});
export type RemixArticleOutput = z.infer<typeof RemixArticleOutputSchema>;


export async function getToneExamples(): Promise<Record<string, string>> {
  return Promise.resolve(toneExamples);
}

export async function remixArticle(
  input: RemixArticleInput
): Promise<RemixArticleOutput> {
  return remixArticleFlow(input);
}


const prompt = ai.definePrompt({
  name: 'remixArticlePrompt',
  input: {schema: RemixArticleInputSchema},
  output: {schema: RemixArticleOutputSchema},
  prompt: `You are an expert content strategist and SEO writer. Your task is to synthesize and rewrite the "Source Articles" into a single, cohesive, and unique article that is Google Discover friendly.

The most important instruction is that the new article's tone, style, sentence structure, and voice MUST perfectly match the "Tone Reference Article".

**Instructions:**
1.  **Analyze the Tone Reference Article:** Deeply understand its writing style—is it casual, professional, witty, technical? Pay attention to sentence length, vocabulary, and paragraph structure.
2.  **Synthesize the Source Articles:** Read through all the source articles to understand the key information, facts, and concepts.
3.  **Write a New Article:** Create a brand-new article by combining the information from the source articles. DO NOT just copy-paste. You must rewrite everything to make it unique.
4.  **Match the Tone:** As you write, ensure the new article sounds exactly like it was written by the same author as the "Tone Reference Article".
5.  **Format as SEO-Friendly HTML:** Structure the final output with appropriate HTML tags. Use multiple catchy <h2> and <h3> headings, <p> for paragraphs, <strong> for important keywords, and lists (<ul>) where appropriate. Do not include <html>, <body>, or <h1> tags.

**Tone Reference Article (Adopt this style):**
\`\`\`
{{{toneReferenceArticle}}}
\`\`\`

**Source Articles (Use this information):**
\`\`\`
{{{sourceArticles}}}
\`\`\`

Now, generate the new, remixed article in HTML format.`,
});

const remixArticleFlow = ai.defineFlow(
  {
    name: 'remixArticleFlow',
    inputSchema: RemixArticleInputSchema,
    outputSchema: RemixArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
