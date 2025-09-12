// src/app/blog/understanding-the-ai-detector/page.tsx
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Image from "next/image";
import { ShieldCheck, Percent, FileScan, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function UnderstandingAiDetectorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <article className="prose dark:prose-invert max-w-none">
            {/* Title */}
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
              Understanding the AI & Originality Detector: A Guide to Authenticity
            </h1>

            {/* Meta */}
            <p className="text-muted-foreground">
              Published on {new Date('2023-10-25').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            {/* Hero Image */}
            <div className="relative my-8 h-96 w-full">
              <Image
                src="https://picsum.photos/seed/blog5/1200/800"
                alt="AI detection interface"
                fill
                objectFit="cover"
                className="rounded-lg shadow-xl"
                data-ai-hint="magnifying glass text"
              />
            </div>

            {/* Introduction */}
            <p className="lead text-xl">
              In an age of AI-generated content, authenticity is more valuable than ever. WriteBot's AI & Originality Detector is designed to be your first line of defense, helping you ensure your content feels human-written and original. This guide will help you interpret its results effectively.
            </p>

            <h2 id="the-ai-score">What Does the AI Detection Score Mean?</h2>
            <p>
              The score you receive is a probability, not a definitive verdict. It represents the likelihood that the text was written by an AI. Here’s a general guide to interpreting the score:
            </p>

            <div className="not-prose my-8 space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="flex-1">
                            <CardTitle>0-40%: Likely Human-Written</CardTitle>
                            <CardDescription>The text shows patterns consistent with human writing.</CardDescription>
                        </div>
                        <span className="text-2xl font-bold text-green-500">Low</span>
                    </CardHeader>
                    <CardContent>
                       <Progress value={25} className="[&>div]:bg-green-500" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                         <div className="flex-1">
                            <CardTitle>41-70%: Potentially AI-Generated or Mixed</CardTitle>
                            <CardDescription>The text may contain some AI-like phrases or be heavily edited AI content.</CardDescription>
                        </div>
                        <span className="text-2xl font-bold text-yellow-500">Medium</span>
                    </CardHeader>
                    <CardContent>
                       <Progress value={55} className="[&>div]:bg-yellow-500" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                         <div className="flex-1">
                            <CardTitle>71-100%: Likely AI-Generated</CardTitle>
                            <CardDescription>The text strongly exhibits patterns typical of AI models.</CardDescription>
                        </div>
                        <span className="text-2xl font-bold text-red-500">High</span>
                    </CardHeader>
                    <CardContent>
                       <Progress value={85} className="[&>div]:bg-red-500" />
                    </CardContent>
                </Card>
            </div>
            
            <h2 id="using-the-analysis">How to Use the Analysis</h2>
            <p>The tool provides more than just a score. Here's how to use the other features:</p>
            <ul className="list-disc pl-5 space-y-3">
              <li>
                <strong>Highlighted Text:</strong> This is the most actionable part of the analysis. The tool highlights specific sentences or phrases that sound robotic or follow common AI patterns. Focus on rewriting these highlighted sections to inject a more human and personal voice.
              </li>
              <li>
                <strong>Summary Analysis:</strong> This provides a brief, human-readable explanation for the score. It might point out factors like repetitive sentence structure or overly formal language.
              </li>
              <li>
                <strong>Originality Warning:</strong> This is **not a plagiarism checker**. It's designed to flag text that seems overly generic or unoriginal. If you get a warning, it's a sign that your content might not be unique enough to stand out, even if it's not plagiarized.
              </li>
            </ul>

            <h2 id="best-practices">Best Practices for Authentic Content</h2>
             <div className="not-prose my-8 space-y-4">
                 <div className="flex items-start gap-4">
                     <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <p><strong>Use AI as a Co-Pilot, Not an Autopilot:</strong> Use AI tools to generate a first draft, brainstorm ideas, or overcome writer's block. Then, take the driver's seat to edit, add personal stories, and refine the content with your unique expertise.</p>
                 </div>
                 <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <p><strong>Edit for Voice and Tone:</strong> Read the content aloud. Does it sound like you? If not, use the "Content Rewriter" tool or manually edit it to match your brand's voice.</p>
                 </div>
                 <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <p><strong>Fact-Check Everything:</strong> AI models can sometimes "hallucinate" or make up facts and statistics. Always verify any data points before publishing.</p>
                 </div>
             </div>
            
            <div className="not-prose my-8 text-center">
              <Button asChild size="lg">
                <Link href="/detect">
                  Check Your Content's Originality Now
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
