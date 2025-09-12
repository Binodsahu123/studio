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
    Hindi: `Vivo V29 5G कंपनी का एक प्रीमियम स्मार्टफोन है जो शानदार डिज़ाइन और बेहतरीन कैमरा क्वालिटी के लिए जाना जाता है। यह फोन खासतौर पर उन यूज़र्स के लिए है जो स्टाइलिश लुक के साथ-साथ मजबूत परफॉर्मेंस और 5G कनेक्टिविटी चाहते हैं।\n\nडिज़ाइन\nVivo V29 5G का डिज़ाइन बहुत ही स्लिम और प्रीमियम है। इसमें कर्व्ड डिस्प्ले दी गई है जो फोन को और भी आकर्षक बनाती है। पीछे की तरफ ग्लास फिनिश के साथ एलिगेंट कैमरा मॉड्यूल दिया गया है। फोन हल्का और हाथ में पकड़ने में आरामदायक है।\n\nडिस्प्ले\nइसमें 6.78 इंच की AMOLED 3D कर्व्ड डिस्प्ले दी गई है, जो 120Hz रिफ्रेश रेट और FHD+ रेज़ॉल्यूशन के साथ आती है। इसकी डिस्प्ले बहुत ही स्मूद और ब्राइट है, जिससे वीडियो देखने, गेमिंग और स्क्रॉलिंग का अनुभव बेहतरीन हो जाता है।\n\nकैमरा\nVivo V29 5G का सबसे बड़ा आकर्षण इसका कैमरा सेटअप है। इसमें 50MP OIS प्राइमरी कैमरा, 8MP अल्ट्रा-वाइड और 2MP डेप्थ सेंसर दिया गया है। वहीं, सेल्फी और वीडियो कॉलिंग के लिए 50MP का हाई-रेज़ॉल्यूशन फ्रंट कैमरा मौजूद है। लो-लाइट फोटोग्राफी और पोर्ट्रेट शॉट्स में यह कैमरा शानदार रिजल्ट देता है।\n\nपरफॉर्मेंस\nयह स्मार्टफोन Qualcomm Snapdragon 778G प्रोसेसर पर चलता है, जो 5G सपोर्ट करता है और स्मूद परफॉर्मेंस देता है। इसमें 8GB/12GB RAM और 128GB/256GB स्टोरेज ऑप्शन उपलब्ध हैं। मल्टीटास्किंग, गेमिंग और हैवी ऐप्स चलाने में फोन बेहद तेज़ और लैग-फ्री परफॉर्मेंस देता है।\n\nबैटरी और चार्जिंग\nVivo V29 5G में 4600mAh की बैटरी दी गई है, जो 80W फास्ट चार्जिंग को सपोर्ट करती है। कंपनी का दावा है कि यह फोन कुछ ही मिनटों में काफी हद तक चार्ज हो जाता है, जिससे यूज़र्स को बैटरी बैकअप को लेकर कोई परेशानी नहीं होती।\n\nदमदार फीचर्स और स्टाइलिश डिजाइन वाला स्मार्टफोन। खरीदे मात्र 13,999 में\n\nसॉफ्टवेयर\nयह स्मार्टफोन Android 13 पर आधारित Funtouch OS के साथ आता है, जिसमें कई कस्टम फीचर्स और पर्सनलाइजेशन ऑप्शन मिलते हैं।\n\nकीमत\nVivo V29 5G की कीमत भारतीय मार्केट में लगभग ₹32,999 से ₹36,999 के बीच रखी गई है, जो इसके वेरिएंट और स्टोरेज पर निर्भर करती है।`
  },
  'Sports': {
    English: `The final whistle blew, and the stadium erupted. Manchester United has secured a dramatic 2-1 victory over Liverpool in a nail-biting encounter at Old Trafford. The match, filled with end-to-end action, saw Marcus Rashford score a stunning winner in the 88th minute, sending the home fans into delirium. Liverpool's defense, which had been solid for most of the game, was finally breached by a moment of individual brilliance.`,
    Hindi: `अंतिम सीटी बजी और स्टेडियम गूंज उठा। मैनचेस्टर यूनाइटेड ने ओल्ड ट्रैफर्ड में एक रोमांचक मुकाबले में लिवरपूल पर 2-1 से नाटकीय जीत हासिल की है। शुरू से अंत तक एक्शन से भरपूर इस मैच में, मार्कस रैशफोर्ड ने 88वें मिनट में एक शानदार विजयी गोल किया, जिससे घरेलू प्रशंसक झूम उठे। लिवरपूल का डिफेंस, जो ज़्यादातर खेल में मज़बूत था, अंततः व्यक्तिगत प्रतिभा के एक पल में टूट गया।`
  },
  'Politics': {
    English: `The Parliament session concluded today after a week of heated debates on the new infrastructure bill. The opposition raised significant concerns regarding the bill's financial implications and environmental impact. The ruling party, however, maintained that the legislation is crucial for national economic growth and modernization. The bill is now set to be presented in the upper house for further deliberation next month.`,
    Hindi: `नए इंफ्रास्ट्रक्चर बिल पर एक सप्ताह की गरमागरम बहस के बाद आज संसद सत्र का समापन हो गया। विपक्ष ने बिल के वित्तीय प्रभावों और पर्यावरणीय प्रभाव के संबंध में महत्वपूर्ण चिंताएँ उठाईं। हालाँकि, सत्ता पक्ष ने यह कहा कि यह कानून राष्ट्रीय आर्थिक विकास और आधुनिकीकरण के लिए महत्वपूर्ण है। यह बिल अब अगले महीने ऊपरी सदन में आगे की चर्चा के लिए प्रस्तुत किया जाएगा।`
  },
  'Technology': {
    English: `Cybersecurity firm 'NexusGuard' has just unveiled its latest AI-powered threat detection platform, "Aegis 7." The new system utilizes advanced machine learning algorithms to predict and neutralize zero-day attacks in real-time. According to the company, Aegis 7 can analyze billions of data points per second, offering an unprecedented level of protection for enterprise networks against sophisticated cyber threats.`,
    Hindi: `साइबर सुरक्षा फर्म 'नेक्ससगार्ड' ने अभी-अभी अपने नवीनतम AI-संचालित थ्रेट डिटेक्शन प्लेटफॉर्म, "एजिस 7" का अनावरण किया है। यह नया सिस्टम वास्तविक समय में ज़ीरो-डे हमलों की भविष्यवाणी करने और उन्हें बेअसर करने के लिए उन्नत मशीन लर्निंग एल्गोरिदम का उपयोग करता है। कंपनी के अनुसार, एजिस 7 प्रति सेकंड अरबों डेटा पॉइंट्स का विश्लेषण कर सकता है, जो एंटरप्राइज़ नेटवर्क को परिष्कृत साइबर खतरों से अभूतपूर्व स्तर की सुरक्षा प्रदान करता है।`
  },
  'Law': {
    English: `In a landmark judgment, the Supreme Court has ruled that the right to privacy is a fundamental right under Article 21 of the Constitution. The verdict, delivered by a nine-judge bench, overrules previous judgments on the matter. Legal experts believe this decision will have wide-ranging implications for data protection laws and individual freedoms in the digital age. The ruling emphasizes the intrinsic value of privacy and its importance for human dignity.`,
    Hindi: `एक ऐतिहासिक फैसले में, सुप्रीम कोर्ट ने फैसला सुनाया है कि निजता का अधिकार संविधान के अनुच्छेद 21 के तहत एक मौलिक अधिकार है। नौ-न्यायाधीशों की पीठ द्वारा दिया गया यह फैसला इस मामले पर पिछले फैसलों को खारिज करता है। कानूनी विशेषज्ञों का मानना है कि इस फैसले का डिजिटल युग में डेटा संरक्षण कानूनों और व्यक्तिगत स्वतंत्रता पर दूरगामी प्रभाव पड़ेगा। यह फैसला निजता के आंतरिक मूल्य और मानव गरिमा के लिए इसके महत्व पर जोर देता है।`
  },
  'Government': {
    English: `The Ministry of Health and Family Welfare has announced the rollout of the second phase of its nationwide vaccination drive, starting August 1st. This phase will target individuals between the ages of 18 and 44. Citizens can register through the official government portal. The ministry has assured that adequate vaccine stocks have been allocated to all states to ensure a smooth and efficient process.`,
    Hindi: `स्वास्थ्य और परिवार कल्याण मंत्रालय ने 1 अगस्त से अपने राष्ट्रव्यापी टीकाकरण अभियान के दूसरे चरण की शुरुआत की घोषणा की है। इस चरण में 18 से 44 वर्ष की आयु के व्यक्तियों को लक्षित किया जाएगा। नागरिक आधिकारिक सरकारी पोर्टल के माध्यम से पंजीकरण कर सकते हैं। मंत्रालय ने आश्वस्त किया है कि एक सहज और कुशल प्रक्रिया सुनिश्चित करने के लिए सभी राज्यों को पर्याप्त वैक्सीन स्टॉक आवंटित किए गए हैं।`
  },
  'Games': {
    English: `Developer 'PixelHeart Studios' has just dropped the gameplay trailer for their highly anticipated open-world RPG, "Chronicles of Aethel." The trailer showcases the game's breathtaking visuals, dynamic combat system, and a sprawling world filled with mythical creatures. Fans are particularly excited about the non-linear storyline, which promises a unique experience for every player. The game is slated for a Q4 2024 release.`,
    Hindi: `डेवलपर 'पिक्सेलहार्ट स्टूडियोज' ने अभी-अभी अपनी बहुप्रतीक्षित ओपन-वर्ल्ड आरपीजी, "क्रॉनिकल्स ऑफ एथेल" का गेमप्ले ट्रेलर जारी किया है। ट्रेलर गेम के लुभावने दृश्यों, गतिशील युद्ध प्रणाली और पौराणिक प्राणियों से भरी एक विशाल दुनिया को दिखाता है। प्रशंसक विशेष रूप से नॉन-लीनियर कहानी को लेकर उत्साहित हैं, जो हर खिलाड़ी के लिए एक अनूठा अनुभव का वादा करती है। यह गेम 2024 की चौथी तिमाही में रिलीज़ होने वाला है।`
  },
  'Jobs': {
    English: `As companies increasingly adopt remote work policies, the demand for roles in cybersecurity, cloud computing, and data analytics has skyrocketed. A recent report by LinkedIn indicates that "Data Scientist" and "AI Specialist" are among the fastest-growing job titles globally. To remain competitive, professionals are encouraged to upskill in these high-demand areas. The report also highlights the growing importance of soft skills like communication and adaptability in the modern workplace.`,
    Hindi: `जैसे-जैसे कंपनियाँ दूरस्थ कार्य नीतियों को अपना रही हैं, साइबर सुरक्षा, क्लाउड कंप्यूटिंग और डेटा एनालिटिक्स में भूमिकाओं की माँग आसमान छू गई है। लिंक्डइन की एक हालिया रिपोर्ट से पता चलता है कि "डेटा साइंटिस्ट" और "एआई स्पेशलिस्ट" विश्व स्तर पर सबसे तेजी से बढ़ते जॉब टाइटल्स में से हैं। प्रतिस्पर्धी बने रहने के लिए, पेशेवरों को इन उच्च-माँग वाले क्षेत्रों में अपने कौशल को बढ़ाने के लिए प्रोत्साहित किया जाता है। रिपोर्ट आधुनिक कार्यस्थल में संचार और अनुकूलनशीलता जैसे सॉफ्ट स्किल्स के बढ़ते महत्व पर भी प्रकाश डालती है।`
  },
  'Education': {
    English: `The new National Education Policy emphasizes a shift from rote learning to a more holistic, inquiry-based approach. It introduces a 5+3+3+4 school curriculum structure, replacing the traditional 10+2 system. A key focus is the integration of vocational training from the 6th grade, aiming to equip students with practical skills. The policy also aims to increase the Gross Enrolment Ratio in higher education to 50% by 2035.`,
    Hindi: `नई राष्ट्रीय शिक्षा नीति रटने वाली शिक्षा से हटकर अधिक समग्र, पूछताछ-आधारित दृष्टिकोण पर जोर देती है। यह पारंपरिक 10+2 प्रणाली की जगह 5+3+3+4 स्कूल पाठ्यक्रम संरचना का परिचय देती है। एक मुख्य फोकस 6वीं कक्षा से व्यावसायिक प्रशिक्षण का एकीकरण है, जिसका उद्देश्य छात्रों को व्यावहारिक कौशल से लैस करना है। नीति का लक्ष्य 2035 तक उच्च शिक्षा में सकल नामांकन अनुपात को 50% तक बढ़ाना भी है।`
  },
  'Business': {
    English: `Reliance Industries Limited (RIL) announced its quarterly earnings today, posting a record-breaking net profit of ₹18,549 crore, a 15% year-on-year increase. The growth was primarily driven by strong performance in its retail and telecom ventures. The company's stock surged by 3% following the announcement. Analysts suggest that RIL's diversified portfolio continues to be a key factor in its sustained financial success.`,
    Hindi: `रिलायंस इंडस्ट्रीज लिमिटेड (RIL) ने आज अपनी तिमाही आय की घोषणा की, जिसमें ₹18,549 करोड़ का रिकॉर्ड-तोड़ शुद्ध लाभ दर्ज किया गया, जो साल-दर-साल 15% की वृद्धि है। यह वृद्धि मुख्य रूप से इसके खुदरा और दूरसंचार उपक्रमों में मजबूत प्रदर्शन से प्रेरित थी। घोषणा के बाद कंपनी के स्टॉक में 3% की तेजी आई। विश्लेषकों का सुझाव है कि RIL का विविध पोर्टफोलियो इसकी निरंतर वित्तीय सफलता में एक महत्वपूर्ण कारक बना हुआ है।`
  },
  'Finance': {
    English: `The Reserve Bank of India (RBI) has kept the repo rate unchanged at 6.5% for the sixth consecutive time, citing persistent inflationary pressures. The decision by the Monetary Policy Committee (MPC) was unanimous. The central bank has maintained its GDP growth forecast for the fiscal year at 7%, but remains cautious about the inflation outlook, which is projected to average 5.4% for the year.`,
    Hindi: `भारतीय रिजर्व बैंक (RBI) ने लगातार छठी बार रेपो दर को 6.5% पर अपरिवर्तित रखा है, जिसका कारण लगातार मुद्रास्फीति का दबाव है। मौद्रिक नीति समिति (MPC) का यह निर्णय सर्वसम्मत था। केंद्रीय बैंक ने चालू वित्त वर्ष के लिए अपने सकल घरेलू उत्पाद की वृद्धि का अनुमान 7% पर बनाए रखा है, लेकिन मुद्रास्फीति के दृष्टिकोण के बारे में सतर्क है, जिसके इस वर्ष औसतन 5.4% रहने का अनुमान है।`
  },
  'Entertainment': {
    English: `The trailer for the much-anticipated sci-fi epic "Nexus Point" has finally dropped, and it's already breaking the internet. Directed by visionary filmmaker Anya Sharma, the film stars superstar Vikram Rao in a role that promises to be a visual spectacle. Fans are praising the stunning visual effects and intriguing plot. "Nexus Point" is set to hit theaters worldwide this December, and is expected to be a major box office hit.`,
    Hindi: `बहुप्रतीक्षित साइंस-फिक्शन महाकाव्य "नेक्सस पॉइंट" का ट्रेलर आखिरकार आ गया है, और यह पहले से ही इंटरनेट पर धूम मचा रहा है। दूरदर्शी फिल्म निर्माता अन्या शर्मा द्वारा निर्देशित, इस फिल्म में सुपरस्टार विक्रम राव एक ऐसी भूमिका में हैं जो एक विज़ुअल स्पेक्टेकल होने का वादा करती है। प्रशंसक शानदार विज़ुअल इफेक्ट्स और दिलचस्प कहानी की प्रशंसा कर रहे हैं। "नेक्सस पॉइंट" इस दिसंबर में दुनिया भर के सिनेमाघरों में रिलीज़ होने के लिए तैयार है, और उम्मीद है कि यह एक बड़ी बॉक्स ऑफिस हिट होगी।`
  },
  'Autos/Vehicles': {
    English: `Tata Motors has launched the all-new Safari EV, marking its entry into the electric SUV segment. The Safari EV boasts an impressive claimed range of 500 km on a single charge and comes packed with features like a panoramic sunroof, a 12.3-inch touchscreen, and advanced driver-assistance systems (ADAS). Bookings are now open, with introductory prices starting at ₹25 lakh (ex-showroom).`,
    Hindi: `टाटा मोटर्स ने ऑल-न्यू सफारी EV लॉन्च की है, जो इलेक्ट्रिक SUV सेगमेंट में इसके प्रवेश का प्रतीक है। सफारी EV एक बार चार्ज करने पर 500 किमी की प्रभावशाली दावा की गई रेंज का दावा करती है और पैनोरमिक सनरूफ, 12.3-इंच टचस्क्रीन और एडवांस्ड ड्राइवर-असिस्टेंस सिस्टम (ADAS) जैसी सुविधाओं से लैस है। बुकिंग अब खुली है, जिसकी शुरुआती कीमत ₹25 लाख (एक्स-शोरूम) से शुरू होती है।`
  },
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
