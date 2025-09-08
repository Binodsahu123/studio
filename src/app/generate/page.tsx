// src/app/generate/page.tsx
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BotMessageSquare, ImageIcon, LayoutTemplate, TrendingUp, ShieldCheck, ArrowRight, Construction } from "lucide-react";

const tools = [
  {
    icon: <BotMessageSquare className="h-8 w-8 text-primary" />,
    title: "AI Content Writer",
    description: "Generate high-quality articles, blog posts, and marketing copy in various languages.",
    href: "/write",
    cta: "Start Writing",
    active: true,
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: "Advanced SEO Analyzer",
    description: "Get keyword insights, difficulty analysis, and title suggestions to boost your rankings.",
    href: "/seo",
    cta: "Analyze Keywords",
    active: true,
  },
  {
    icon: <Construction className="h-8 w-8 text-muted-foreground" />,
    title: "AI Image Generator",
    description: "This feature is under construction. Create stunning visuals and art from a simple text description.",
    href: "/image",
    cta: "Coming Soon",
    active: false,
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "AI & Originality Detector",
    description: "Check for AI-generated content and ensure the originality of your text.",
    href: "/detect",
    cta: "Detect Content",
    active: true,
  },
];


export default function GeneratePage() {
  const CardWrapper = ({ tool, children }: { tool: any, children: React.ReactNode }) => {
    if (tool.active) {
      return <Link href={tool.href} className="block group h-full">{children}</Link>;
    }
    return <div className="h-full opacity-50 cursor-not-allowed">{children}</div>;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-headline">
            Choose Your Tool
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Select from our suite of powerful AI tools to start creating amazing content.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {tools.map((tool) => (
            <CardWrapper tool={tool} key={tool.title}>
              <Card className={`flex flex-col h-full transition-all duration-300 ${tool.active ? 'group-hover:border-primary/50 group-hover:shadow-lg group-hover:-translate-y-1' : ''}`}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {tool.icon}
                    <CardTitle className="text-2xl">{tool.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <CardDescription className="text-base mb-4">
                    {tool.description}
                  </CardDescription>
                  <div className={`flex items-center font-semibold ${tool.active ? 'text-primary group-hover:text-primary/80' : 'text-muted-foreground'}`}>
                    {tool.cta}
                    {tool.active && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
                  </div>
                </CardContent>
              </Card>
            </CardWrapper>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
