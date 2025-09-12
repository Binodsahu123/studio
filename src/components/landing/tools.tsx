import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BotMessageSquare, ImageIcon, TrendingUp, ShieldCheck, ArrowRight, FileText, Mic, Wand2, FileCode, Hash, Search, Combine } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    icon: <BotMessageSquare className="h-8 w-8 text-primary" />,
    title: "AI Content Writer",
    description: "Generate high-quality articles, blog posts, and marketing copy in various languages.",
    href: "/write",
    cta: "Start Writing",
  },
  {
    icon: <Wand2 className="h-8 w-8 text-primary" />,
    title: "Content Rewriter",
    description: "Rephrase, shorten, or change the tone of your existing text to make it fresh and unique.",
    href: "/rewrite",
    cta: "Rewrite Content",
  },
    {
    icon: <FileCode className="h-8 w-8 text-primary" />,
    title: "Text to HTML Converter",
    description: "Convert plain text into SEO-friendly, structured HTML automatically.",
    href: "/html-converter",
    cta: "Convert to HTML",
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Full Blog Post Workflow",
    description: "A step-by-step wizard to generate keywords, titles, outlines, and a full article from a single topic.",
    href: "/blog",
    cta: "Start Workflow",
  },
   {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "Keyword Ideas",
    description: "Discover new keywords, analyze their competition, and check estimated search volume.",
    href: "/keywords",
    cta: "Find Keywords",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: "Advanced SEO Analyzer",
    description: "Get keyword insights, difficulty analysis, and title suggestions to boost your rankings.",
    href: "/seo",
cta: "Analyze Keywords",
  },
  {
    icon: <ImageIcon className="h-8 w-8 text-primary" />,
    title: "AI Image Generator",
    description: "Create stunning visuals and art from a simple text description using advanced AI models.",
    href: "/image",
    cta: "Generate Images",
  },
  {
    icon: <Mic className="h-8 w-8 text-primary" />,
    title: "AI Voiceover Generator",
    description: "Convert text into natural-sounding speech for your projects in multiple languages and voices.",
    href: "/voiceover",
    cta: "Create Voiceover",
  },
   {
    icon: <Hash className="h-8 w-8 text-primary" />,
    title: "AI Hashtag Generator",
    description: "Generate viral and trending hashtags for Instagram, YouTube, and more from a topic or category.",
    href: "/hashtag",
    cta: "Get Hashtags",
  },
   {
    icon: <Combine className="h-8 w-8 text-primary" />,
    title: "SEO Assets Generator",
    description: "Enter a title to get SEO tags, hashtags, and a meta description all at once.",
    href: "/seo-assets",
    cta: "Generate Assets",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "AI & Originality Detector",
    description: "Check for AI-generated content and ensure the originality of your text before publishing.",
    href: "/detect",
    cta: "Detect Content",
  },
];

export function Tools() {
  return (
    <section id="tools" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-headline">
            Our Powerful Suite of AI Tools
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            From content creation to SEO analysis, we have the right tool for every step of your workflow.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
          {tools.map((tool) => (
             <Link href={tool.href} key={tool.title} className="block group h-full">
              <Card className="flex flex-col md:flex-row h-full transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg group-hover:-translate-y-1 p-6 items-start md:items-center gap-6">
                  {tool.icon}
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{tool.title}</CardTitle>
                    <CardDescription className="text-base">
                        {tool.description}
                    </CardDescription>
                  </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
