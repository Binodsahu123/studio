// src/app/blog/introducing-writebot-ai/page.tsx
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Image from "next/image";
import { CheckCircle, BotMessageSquare, Wand2, FileText, TrendingUp, ImageIcon, Mic, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function BlogIntroducingWriteBotAI() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <article className="prose dark:prose-invert max-w-none">
            {/* Title */}
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
              Unleash Your Content Superpowers: A Deep Dive into WriteBot AI
            </h1>

            {/* Meta */}
            <p className="text-muted-foreground">
              Published on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            {/* Hero Image */}
            <div className="relative my-8 h-96 w-full">
              <Image
                src="https://picsum.photos/1200/800"
                alt="AI powered content creation"
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-xl"
                data-ai-hint="futuristic writer desk"
              />
            </div>

            {/* Introduction */}
            <p className="lead text-xl">
              In the fast-paced digital world, content is king. But creating high-quality, engaging, and SEO-optimized content consistently can be a monumental task. What if you could have a tireless, creative partner available 24/7? Meet <strong>WriteBot AI</strong>, the all-in-one platform designed to revolutionize your content creation workflow.
            </p>

            <p>
              Whether you're a blogger, marketer, developer, or business owner, WriteBot AI provides the tools you need to not just create content, but to create content that performs. Let's take a deep dive into the powerful features that make WriteBot AI your ultimate content sidekick.
            </p>

            {/* Features Section */}
            <h2 id="features">The Ultimate Tool-belt for Modern Creators</h2>
            <p>
              WriteBot AI isn't just one tool; it's a suite of interconnected applications designed to handle every aspect of content creation.
            </p>

            <div className="not-prose my-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                    <CardContent className="p-6">
                        <BotMessageSquare className="h-8 w-8 text-primary mb-3" />
                        <h3 className="text-xl font-semibold">AI Content Writer</h3>
                        <p className="text-muted-foreground mt-2">Generate complete articles, ad copy, or social media posts in multiple languages from a simple prompt.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-6">
                        <Wand2 className="h-8 w-8 text-primary mb-3" />
                        <h3 className="text-xl font-semibold">Content Rewriter</h3>
                        <p className="text-muted-foreground mt-2">Transform your existing text. Adopt different tones—from a professional email to a casual blog post—with a single click.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-6">
                        <FileText className="h-8 w-8 text-primary mb-3" />
                        <h3 className="text-xl font-semibold">Full Blog Post Workflow</h3>
                        <p className="text-muted-foreground mt-2">Our step-by-step wizard guides you from keyword generation and title selection to creating an outline and writing the final article.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-6">
                        <TrendingUp className="h-8 w-8 text-primary mb-3" />
                        <h3 className="text-xl font-semibold">Advanced SEO Analyzer</h3>
                        <p className="text-muted-foreground mt-2">Gain a competitive edge with keyword difficulty analysis, virality potential, and catchy, SEO-friendly title suggestions.</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="relative my-8 h-80 w-full">
              <Image
                src="https://picsum.photos/1024/768"
                alt="AI Image Generator Showcase"
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-lg"
                data-ai-hint="digital art gallery"
              />
            </div>

            <h2 id="multimedia">Beyond Text: Multimedia and Assurance</h2>
             <div className="not-prose my-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                    <CardContent className="p-6">
                        <ImageIcon className="h-8 w-8 text-primary mb-3" />
                        <h3 className="text-xl font-semibold">AI Image Generator</h3>
                        <p className="text-muted-foreground mt-2">Bring your ideas to life. Create stunning, unique visuals and artwork from a simple text description.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-6">
                        <Mic className="h-8 w-8 text-primary mb-3" />
                        <h3 className="text-xl font-semibold">AI Voiceover Generator</h3>
                        <p className="text-muted-foreground mt-2">Convert your written content into natural-sounding audio for podcasts, videos, and presentations in multiple languages and accents.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardContent className="p-6">
                        <ShieldCheck className="h-8 w-8 text-primary mb-3" />
                        <h3 className="text-xl font-semibold">AI & Originality Detector</h3>
                        <p className="text-muted-foreground mt-2">Ensure your content is authentic by checking for AI patterns and potential unoriginal text before you publish.</p>
                    </CardContent>
                </Card>
            </div>
            
            <h2 id="security">Secure, Private, and Ready for Business</h2>
            <p>We understand that selling a script requires trust and security. That's why we've built-in a robust, one-time activation system.</p>
             <div className="not-prose my-8 flex items-center gap-6 rounded-lg border bg-secondary p-6">
                <ShieldCheck className="h-12 w-12 text-primary flex-shrink-0" />
                <div>
                    <h3 className="text-xl font-semibold">One-Time Script Activation</h3>
                    <p className="text-muted-foreground mt-2">
                        WriteBot AI includes a secure licensing system. When you set up the script on your hosting for the first time, you'll be prompted to enter a secret code. This one-time activation ensures that your purchase is secure, and after that, the application runs seamlessly without any interruptions for you or your end-users.
                    </p>
                </div>
            </div>

            <h2 id="getting-started">Ready to Get Started?</h2>
            <p>
              WriteBot AI is more than just a set of tools—it's a complete ecosystem for modern content creation. Stop staring at a blank page and start bringing your ideas to life, faster than ever before.
            </p>
            
            <div className="not-prose my-8 text-center">
              <Button asChild size="lg">
                <Link href="/generate">
                  Start Creating with WriteBot AI
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
