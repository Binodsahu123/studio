// src/app/blog/how-to-use-ai-content-writer/page.tsx
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Image from "next/image";
import { Lightbulb, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowToUseAiWriterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <article className="prose dark:prose-invert max-w-none">
            {/* Title */}
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
              How to Master the AI Content Writer for Top-Tier Articles
            </h1>

            {/* Meta */}
            <p className="text-muted-foreground">
              Published on {new Date('2023-10-26').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            {/* Hero Image */}
            <div className="relative my-8 h-96 w-full">
              <Image
                src="https://picsum.photos/seed/blog4/1200/800"
                alt="AI writer creating content"
                fill
                objectFit="cover"
                className="rounded-lg shadow-xl"
                data-ai-hint="writer keyboard focus"
              />
            </div>

            {/* Introduction */}
            <p className="lead text-xl">
              The AI Content Writer is one of the most powerful tools in your WriteBot AI arsenal. It can transform a simple idea into a full-fledged, SEO-optimized article. But to get the best results, you need to know how to wield it effectively. This guide will walk you through mastering this tool.
            </p>

            <h2 id="understanding-the-inputs">Understanding the Inputs: Garbage In, Garbage Out</h2>
            <p>
              The quality of your output is directly proportional to the quality of your input. Here’s how to make each field work for you:
            </p>

            <div className="not-prose my-8 space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <FileText className="h-8 w-8 text-primary" />
                        <CardTitle>Topic / Main Title: Be Specific</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">This is the most crucial input. Specificity is your best friend.</p>
                        <ul className="mt-4 list-disc pl-5 space-y-2">
                          <li><strong>Bad:</strong> "New phone"</li>
                          <li><strong>Good:</strong> "Compare camera quality: Samsung S24 Ultra vs. iPhone 15 Pro Max"</li>
                          <li><strong>Bad:</strong> "Marketing tips"</li>
                          <li><strong>Good:</strong> "Top 5 content marketing strategies for small e-commerce businesses in 2024"</li>
                        </ul>
                         <p className="mt-4 text-sm text-muted-foreground">The more detailed your title, the more focused and relevant the generated article will be.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Lightbulb className="h-8 w-8 text-primary" />
                        <CardTitle>Short Description: Set the Context</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Think of this as a mini-brief for the AI. Explain the goal of the article.</p>
                         <ul className="mt-4 list-disc pl-5 space-y-2">
                           <li><strong>Example:</strong> For the title "Top 5 content marketing strategies...", your description could be: "An article aimed at small business owners, providing actionable, budget-friendly content marketing tips. The tone should be encouraging and straightforward."</li>
                         </ul>
                    </CardContent>
                </Card>
            </div>
            
            <h2 id="leveraging-the-output">Leveraging the Generated Assets</h2>
            <p>The AI doesn't just give you an article; it provides a full content package. Here’s how to use it:</p>
            <ul className="list-disc pl-5 space-y-3">
              <li>
                <strong>Title Suggestions:</strong> The AI provides 10 alternative titles. Don't just stick with your original one. Review the suggestions for more catchy or SEO-friendly options. Pick the one that best grabs attention.
              </li>
              <li>
                <strong>Meta Description:</strong> This is crucial for search engine results pages (SERPs). The generated description is optimized to be under 160 characters and entice clicks. Use it in your blog's SEO settings.
              </li>
              <li>
                <strong>Focus Keywords:</strong> Use this comma-separated list for your website's SEO plugin (like Rank Math or Yoast) to ensure your article is optimized for the right terms.
              </li>
              <li>
                <strong>Image Titles / Alt Text:</strong> When you add images to your post, use these suggestions for your image file names and alt text. This is great for image SEO and accessibility.
              </li>
              <li>
                <strong>The Content Itself:</strong> The generated article is a strong draft, not necessarily the final product. Read through it, add your own personal anecdotes or insights, fact-check any data, and tweak the wording to match your unique voice perfectly.
              </li>
            </ul>

            <h2 id="pro-tips">Pro-Tips for World-Class Content</h2>
             <div className="not-prose my-8 space-y-4">
                 <div className="flex items-start gap-4">
                     <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <p><strong>Iterate and Refine:</strong> If the first draft isn't perfect, don't discard it. Tweak your initial prompt and description and regenerate. Sometimes a small change in the input can lead to a vastly different and better output.</p>
                 </div>
                 <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <p><strong>Use the "Content Rewriter":</strong> If you like the structure but not the tone, copy the generated article and take it to the "Content Rewriter" tool to adjust the style.</p>
                 </div>
             </div>
            
            <div className="not-prose my-8 text-center">
              <Button asChild size="lg">
                <Link href="/write">
                  Try the AI Content Writer Now
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
