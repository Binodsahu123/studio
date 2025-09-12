// src/app/blog/understanding-writebot-tools/page.tsx
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Image from "next/image";
import { BotMessageSquare, Wand2, Blend, FileCode, FileText, Search, TrendingUp, ImageIcon, Mic, Hash, Combine, ShieldCheck, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const toolsGuide = [
  {
    icon: <BotMessageSquare className="h-8 w-8 text-primary" />,
    title: "AI Content Writer",
    description: "Generates full-length articles, marketing copy, and more from a simple prompt.",
    howToUse: "Enter a specific topic (e.g., 'Benefits of green tea'), a short description, and choose a language. The AI will generate a full article, plus SEO titles, a meta description, and image alt text.",
    pros: [
      "Extremely fast content creation from a single idea.",
      "Generates a complete package: article, titles, and SEO assets.",
      "Multi-language support is great for global reach."
    ],
    cons: [
      "May require fact-checking, especially for complex or data-heavy topics.",
      "The generated content might lack deep personal insights or a unique authorial voice."
    ]
  },
  {
    icon: <Wand2 className="h-8 w-8 text-primary" />,
    title: "Content Rewriter",
    description: "Rephrases or changes the tone of existing text based on a sample.",
    howToUse: "Paste your original text in the first box. In the second box, paste a sample text that has the tone and style you want to replicate. The AI will rewrite your original content to match the sample's style.",
    pros: [
      "Excellent for adapting content for different audiences (e.g., formal vs. casual).",
      "Helps overcome duplicate content issues by creating unique versions of existing text.",
      "Gives you fine-grained control over the final writing style."
    ],
    cons: [
      "Effectiveness depends heavily on the quality and clarity of the sample text provided.",
      "May misinterpret nuanced tones if the sample is too short or ambiguous."
    ]
  },
    {
    icon: <Blend className="h-8 w-8 text-primary" />,
    title: "AI Article Mixer & Rephraser",
    description: "Combines multiple articles into one and adopts a professional tone.",
    howToUse: "Paste content from one or more source articles into the first box. Then, select a professional tone category (e.g., 'Technology', 'Sports', 'Business') from the dropdown. The AI will synthesize the information and rewrite it in the selected tone.",
    pros: [
      "Powerful tool for creating comprehensive articles by merging multiple sources.",
      "Pre-defined professional tones ensure high-quality, consistent output.",
      "Saves significant time in research and synthesis."
    ],
    cons: [
      "Requires high-quality source articles for best results.",
      "The final article needs a thorough review to ensure smooth transitions between merged topics."
    ]
  },
  {
    icon: <FileCode className="h-8 w-8 text-primary" />,
    title: "Text to HTML Converter",
    description: "Converts plain text into SEO-friendly HTML.",
    howToUse: "Simply paste your plain text (with headings and paragraphs) into the text area and click 'Convert'. The tool will automatically add appropriate tags like <h2>, <h3>, <p>, and <strong>.",
    pros: [
      "Saves time for bloggers and web developers.",
      "Creates a clean, structured HTML output ready for CMS platforms like WordPress.",
      "Helps improve on-page SEO by using semantic HTML tags."
    ],
    cons: [
      "It's a formatting tool, not a content creator. It won't improve the text itself.",
      "May not handle very complex formatting requirements."
    ]
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Full Blog Post Workflow",
    description: "A step-by-step wizard for complete blog post creation.",
    howToUse: "Follow the 5 steps: 1) Enter a topic. 2) Generate and review keywords. 3) Generate and choose a title. 4) Generate and edit an outline. 5) Generate the final article. It guides you from idea to a full post.",
    pros: [
      "Structured process ensures all key elements of a good blog post are covered.",
      "Excellent for beginners who are unsure about the content creation process.",
      "Breaks down a large task into manageable steps."
    ],
    cons: [
      "The process is linear and can take more time than the simple 'AI Content Writer'.",
      "Requires user input and decisions at each step."
    ]
  },
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "Keyword Ideas",
    description: "Discovers new keywords and analyzes their potential.",
    howToUse: "Enter a broad topic (e.g., 'digital marketing') or choose a category. The AI will generate a list of related keywords with estimated competition and search volume scores.",
    pros: [
      "Great for brainstorming and finding new content opportunities.",
      "Provides scores for difficulty and volume to help prioritize keywords.",
      "Helps you understand what your audience is searching for."
    ],
    cons: [
      "The scores are estimates and may not reflect real-time search data perfectly.",
      "It's a starting point for research, not a replacement for in-depth SEO tools."
    ]
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: "Advanced SEO Analyzer",
    description: "Provides deep keyword insights and title suggestions.",
    howToUse: "Enter a content topic and optionally some of your current keywords. The AI provides a list of improved keywords, their ranking difficulty, virality potential, and several catchy title suggestions for each.",
    pros: [
      "Goes beyond keywords to provide actionable content strategy (titles).",
      "Helps you target keywords with high virality potential.",
      "Improves the click-through rate of your articles with better titles."
    ],
    cons: [
      "The 'difficulty' and 'virality' metrics are AI estimations and subjective.",
      "Best used by those with a basic understanding of SEO principles."
    ]
  },
  {
    icon: <ImageIcon className="h-8 w-8 text-primary" />,
    title: "AI Image Generator",
    description: "Creates visuals and art from a text description.",
    howToUse: "Write a detailed description of the image you want in the prompt box. Be specific about the subject, style, colors, and composition. For example, 'A photorealistic image of an astronaut riding a horse on Mars.'",
    pros: [
      "Creates 100% unique, royalty-free images in seconds.",
      "Perfect for blog post thumbnails, social media, and marketing visuals.",
      "Unlocks creative possibilities that are difficult to find in stock photos."
    ],
    cons: [
      "Can sometimes misinterpret complex prompts or struggle with details like hands or text.",
      "Image quality can vary depending on the complexity of the prompt."
    ]
  },
  {
    icon: <Mic className="h-8 w-8 text-primary" />,
    title: "AI Voiceover Generator",
    description: "Converts text into natural-sounding speech.",
    howToUse: "Paste the text you want to convert into the text area, select a voice (e.g., language and gender), and click 'Generate'. You can then listen to and download the audio file.",
    pros: [
      "Creates audio for videos, podcasts, or accessibility features.",
      "Supports multiple languages and accents.",
      "Much cheaper and faster than hiring a voice actor."
    ],
    cons: [
      "The audio, while natural, may not capture the emotional nuance of a human voice actor.",
      "Pronunciation of very specific or technical terms may sometimes need correction."
    ]
  },
  {
    icon: <Hash className="h-8 w-8 text-primary" />,
    title: "AI Hashtag Generator",
    description: "Generates trending hashtags for social media.",
    howToUse: "Enter a topic or title (e.g., 'healthy breakfast ideas') and choose a platform (Instagram or YouTube). The tool will generate a list of relevant and trending hashtags.",
    pros: [
      "Increases the visibility and reach of your social media posts.",
      "Provides a mix of popular and niche hashtags.",
      "Saves time on hashtag research."
    ],
    cons: [
      "Hashtag trends change quickly, so the suggestions should be used as a starting point.",
      "Does not guarantee virality."
    ]
  },
  {
    icon: <Combine className="h-8 w-8 text-primary" />,
    title: "SEO Assets Generator",
    description: "Generates tags, hashtags, and a meta description from a title.",
    howToUse: "Enter a single article title. The AI will instantly generate a comma-separated list of SEO tags, a list of social media hashtags, and a concise meta description (under 160 characters).",
    pros: [
      "Extremely efficient for optimizing a post right after writing the title.",
      "Ensures you don't forget crucial on-page SEO elements.",
      "A huge time-saver for content managers."
    ],
    cons: [
      "The generated assets are based only on the title, so they may lack the depth that comes from a full article.",
      "Best used for standard blog posts; may be less effective for highly niche topics."
    ]
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "AI & Originality Detector",
    description: "Checks text for AI-generated patterns and originality.",
    howToUse: "Paste any text into the box. The tool provides a score from 0-100 indicating the probability of it being AI-generated. It also highlights specific sentences that match AI patterns.",
    pros: [
      "Helps ensure your content feels authentic and human-written.",
      "Useful for editors reviewing content from multiple writers.",
      "Flags overly generic text that might harm SEO."
    ],
    cons: [
      "The score is a probability, not a definitive judgment. It can sometimes produce false positives or negatives.",
      "It is not a plagiarism checker. You should use a dedicated plagiarism tool to check for copied content."
    ]
  },
];

export default function BlogUnderstandingTools() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-12">
            {/* Title */}
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
              A Complete Guide to Every Tool in WriteBot AI
            </h1>

            {/* Meta */}
            <p className="mt-4 text-lg text-muted-foreground">
              Master your content creation process by understanding how to use each tool, its unique benefits, and its limitations.
            </p>

            {/* Hero Image */}
            <div className="relative my-8 h-96 w-full">
              <Image
                src="https://picsum.photos/seed/blog3/1200/800"
                alt="A toolbox of AI content creation tools"
                fill
                objectFit="cover"
                className="rounded-lg shadow-xl"
                data-ai-hint="digital toolbox"
              />
            </div>
            
            <div className="space-y-16">
                {toolsGuide.map(tool => (
                    <Card key={tool.title} className="overflow-hidden">
                        <CardHeader className="bg-secondary/50">
                            <div className="flex items-center gap-4">
                                {tool.icon}
                                <CardTitle className="text-2xl">{tool.title}</CardTitle>
                            </div>
                            <CardDescription className="pt-2 text-base">{tool.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div>
                                <h4 className="font-semibold text-lg mb-2">How to Use It:</h4>
                                <p className="text-muted-foreground">{tool.howToUse}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /> Benefits (Pros)</h4>
                                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                        {tool.pros.map(pro => <li key={pro}>{pro}</li>)}
                                    </ul>
                                </div>
                                 <div>
                                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><XCircle className="h-5 w-5 text-red-500" /> Limitations (Cons)</h4>
                                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                        {tool.cons.map(con => <li key={con}>{con}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="my-16 text-center">
                <Separator className="my-8"/>
                <h2 className="text-3xl font-extrabold">Ready to Start Creating?</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Now that you're an expert on all the tools, it's time to put them to work. Jump in and supercharge your content workflow.
                </p>
              <Button asChild size="lg" className="mt-8">
                <Link href="/generate">
                  Explore All Tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
