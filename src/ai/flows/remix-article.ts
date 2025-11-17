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
import {googleAI} from '@genkit-ai/google-genai';

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
  'Autos/Vehicles': `Daldo 4000cc ताकतवर इंजन और प्रीमियम लुक के साथ Toyota की SUV कार हुई लॉन्च, जानिए कितनी है कीमत

CAR कंपनी Toyota मोटर्स ने भारतीय बाजार में अपनी एक ताकतवर इंजन वाली suv कार को लांच कर दिया है, जो की Toyota FJ Cruiser SUV के नाम से जानी जाती है।

इस फोर व्हीलर में कंपनी की ओर से 4000cc की पावरफुल इंजन का प्रयोग किया गया है। साथ ही इसमें मस्कुलर लोक लग्जरी इंटीरियर और कई आधुनिक फीचर से भी लैस किया गया है चलिए इसके बारे में विस्तार पूर्वक जान लेते हैं।

Toyota FJ Cruiser SUV के इंटीरियर
सबसे पहले बात अगर फोर व्हीलर के इंटीरियर की करें तो कंपनी के द्वारा इसे काफी मस्कुलर लुक दिया गया है। एसयूवी के फ्रंट में यूनिक डिजाइन वाली डंपर और हेडलाइट का प्रयोग किया गया है।

वहीं इसके केबिन में हमें काफी माडर्न डैशबोर्ड लग्जरी इंटीरियर और कंफर्टेबल लेदर सीट मिलती है जो लंबी यात्रा को आरामदायक बनता है।

Toyota FJ Cruiser SUV के फीचर्स
Toyota FJ Cruiser SUV फीचर्स के मामले में भी काफी आधुनिक है कंपनी की ओर से इसमें टचस्क्रीन इन्फोटेनमेंट सिस्टम, ब्लूटूथ कनेक्टिविटी, सेफ्टी के लिए मल्टीप्ल एयरबैग

360 डिग्री कैमरा, ऑटोमेटिक क्लाइमेट कंट्रोल, पावर विंडो, सीट बेल्ट अलर्ट, एलईडी हेडलाइट जैसे कई स्मार्ट और एडवांस्ड फीचर्स का प्रयोग किया गया है।

Toyota FJ Cruiser SUV के इंजन
इंजन और माइलेज के मामले में भी यह एसयूवी काफी कमल की है पावर और परफॉर्मेंस के लिए कंपनी की ओर से 4 लीटर का b6 पेट्रोल इंजन मिलता है जो की 3956cc की होने वाली है।

यह इंजन 380Nm का टॉर्क और 270Bhp की पावर प्रोड्यूस करता है, इस इंजन के साथ पांच स्पीड ऑटोमेटिक गियर Box मिलता है जो की 17 से 18 किलोमीटर तक की माइलेज भी देती है।

Toyota FJ Cruiser SUV के कीमत
अगर आप भी अपने लिए एक ताकतवर इंजन और भौकाली लुक वाली सव खरीदना चाहते हैं तो आप Toyota FJ Cruiser SUV की और अपना रुख कर सकते हैं।

बात अगर कीमत की करें तो बाजार में एसयूवी ₹35 लाख से शुरू होकर 40 लाख रुपए तक की कीमत पर उपलब्ध है।`,
  'Bike News': `Hero Splendor Plus हुआ और भी स्मार्ट, 70KM माइलेज और न्यू मॉडल के साथ मार्केट में हुई एंट्री


देश की दिग्गज दो पहिया वाहन निर्माता कंपनी हीरो मोटर्स ने अपनी सबसे ज्यादा लोकप्रिय मोटरसाइकिल में से एक Hero Splendor Plus के न्यू मॉडल को बाजार में उतार दिया है।


जिसमें कि पहले से कई स्मार्ट फीचर्स और यूनिक डिजाइन का प्रयोग किया गया है। मोटरसाइकिल में इतना सिर्फ पावरफुल इंजन बल्कि 70 किलोमीटर तक की माइलेज और कई स्मार्ट फीचर्स मिलते हैं चलिए इसकी कीमत के बारे में जान लेते हैं।

Hero Splendor Plus के यूनिक डिजाइन 
सबसे पहले तो आपको बता दूं कि नए मॉडल के साथ आई Hero Splendor Plus में कंपनी की ओर से काफी शानदार कलर विकल्प दिए गए हैं। इसके अलावा बाइक के कॉस्मेटिक में بھی बदलाव किए गए हैं।

जिसमें फ्रंट में यूनिक डिजाइन वाली हेडलाइट और एलइडी स्ट्रिप लाइट दी गई है वही इस बार के स्प्लेंडर में फ्रंट में डिस्क ब्रेक का भी प्रयोग किया गया है।

Hero Splendor Plus के फीचर्स
दोस्तों फीचर्स के मामले भी Hero Splendor Plus का न्यू मॉडल काफी एडवांस है। मोटरसाइकिल में फीचर्स के तौर पर फुली डिजिटल स्पीडोमीटर का प्रयोग किया गया है ।

जिसमें फ्यूल लेवल, रियल टाइम स्पीड और टाइम जैसे फीचर्स दिखती है। इसके अलावा LED हेडलाइट, LED इंडिकेटर सेफ्टी के लिए इस बार फ्रंट में डिस्क ब्रेक और रेट में ड्रम ब्रेक जैसे फीचर्स भी मिलेंगे।

Hero Splendor Plus के इंजन
बाइक में मिलने वाले इंजन तथा माइलेज की बात करें तो बेहतर परफॉर्मेंस के लिए इसमें 97.2 cc का सिंगल सिलेंडर एयर कोल्ड इंजन का प्रयोग किया गया है।

यह इंजन 8000 Rpm पर 7.5 Bhp की पावर के साथ 6000 Rpm पर 8.5 Nm का टॉर्क को प्रोड्यूस करता है। वही मोटरसाइकिल कर स्पीड गियर बॉक्स से लैस है जिसमें बेहतर परफॉर्मेंस और 65 से 70 किलोमीटर की माइलेज मिलती है।

Hero Splendor Plus के कीमत
2025 में अगर आप अपने लिए एक मोटरसाइकिल तलाश रहे हैं जिसमें आपको यूनिक लोग स्मार्ट फीचर्स और बेहतर माइलेज भी मिले।

वह भी सस्ते में तो आप न्यू मॉडल के साथ आई Hero Splendor Plus की ओर अपना रुख कर सकते हैं। कीमत की बात करें तो बाजार में यह मोटरसाइकिल ₹75,000 से 85,000 रुपए के बीच उपलब्ध है।`,
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
  model: googleAI.model('gemini-pro'),
  input: {schema: RemixArticleInputSchema},
  output: {schema: RemixArticleOutputSchema},
  prompt: `You are an expert content writer whose only job is to rewrite text in a specific style.

Your most important instruction is to synthesize the "Source Articles" into a single, cohesive article where the tone, style, sentence structure, and voice **PERFECTLY AND EXACTLY MATCH** the "Tone Reference Article".

**Instructions:**
1.  **Analyze the Tone Reference Article:** Deeply understand its writing style. Pay close attention to sentence length, vocabulary, paragraph structure, and overall voice.
2.  **Synthesize Information:** Read the "Source Articles" only to extract the key information, facts, and concepts.
3.  **Rewrite in the Exact Style:** Create a brand-new article using the information from the source articles. **You must rewrite everything to make it sound exactly like it was written by the same author as the "Tone Reference Article".** Do not inject any of your own "AI" style. Your goal is to be an invisible rewriter who perfectly mimics the reference style.
4.  **Format as SEO-Friendly HTML:** Structure the final output with appropriate HTML tags. Use multiple catchy <h2> and <h3> headings, <p> for paragraphs, <strong> for important keywords, and lists (<ul>) where appropriate. Do not include <html>, <body>, or <h1> tags.

**Tone Reference Article (Adopt this style EXACTLY):**
\`\`\`
{{{toneReferenceArticle}}}
\`\`\`

**Source Articles (Use this information ONLY):**
\`\`\`
{{{sourceArticles}}}
\`\`\`

Now, generate the new, remixed article in HTML format. Your output must be indistinguishable in style from the Tone Reference Article.`,
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
