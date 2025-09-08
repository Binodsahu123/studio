// src/app/generate/page.tsx
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BotMessageSquare, ImageIcon, LayoutTemplate, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";

const tools = [
  {
    icon: <BotMessageSquare className="h-8 w-8 text-primary" />,
    title: "AI Content Writer",
    description: "Generate high-quality articles, blog posts, and marketing copy in various languages.",
    href: "/write",
    cta: "Start Writing"
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: "Advanced SEO Analyzer",
    description: "Get keyword insights, difficulty analysis, and title suggestions to boost your rankings.",
    href: "/seo",
    cta: "Analyze Keywords"
  },
  {
    icon: <ImageIcon className="h-8 w-8 text-primary" />,
    title: "AI Image Generator",
    description: "Create stunning visuals and art from a simple text description in seconds.",
    href: "/image",
    cta: "Generate Images"
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "AI & Originality Detector",
    description: "Check for AI-generated content and ensure the originality of your text.",
    href: "/detect",
    cta: "Detect Content"
  },
];


export default function GeneratePage() {
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
            <Link href={tool.href} key={tool.title} className="block group">
              <Card className="flex flex-col h-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
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
                  <div className="flex items-center font-semibold text-primary group-hover:text-primary/80">
                    {tool.cta} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
