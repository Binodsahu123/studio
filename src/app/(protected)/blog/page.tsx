// src/app/blog/page.tsx
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    title: "How to Master the AI Content Writer for Top-Tier Articles",
    description: "A deep dive into leveraging our AI Content Writer. Learn how to craft the perfect prompts, choose the right settings, and generate content that captivates and converts.",
    href: "/blog/how-to-use-ai-content-writer",
    imageUrl: "https://picsum.photos/seed/blog4/400/250",
    imageHint: "writer keyboard focus",
    date: "October 26, 2023",
  },
  {
    title: "Understanding the AI & Originality Detector: A Guide to Authenticity",
    description: "What does the AI score mean? How can you ensure your content is authentic? This guide breaks down how our detector works and how to use it to maintain your credibility.",
    href: "/blog/understanding-the-ai-detector",
    imageUrl: "https://picsum.photos/seed/blog5/400/250",
    imageHint: "magnifying glass text",
    date: "October 25, 2023",
  },
  {
    title: "A Complete Guide to Every Tool in WriteBot AI",
    description: "Master your content creation process by understanding how to use each tool, its unique benefits, and its limitations. From writing to SEO, we've got you covered.",
    href: "/blog/understanding-writebot-tools",
    imageUrl: "https://picsum.photos/seed/blog3/400/250",
    imageHint: "digital toolbox",
    date: "October 24, 2023",
  },
  {
    title: "Unleash Your Content Superpowers: A Deep Dive into WriteBot AI",
    description: "In the fast-paced digital world, content is king. Discover how WriteBot AI's all-in-one platform can revolutionize your content creation workflow from start to finish.",
    href: "/blog/introducing-writebot-ai",
    imageUrl: "https://picsum.photos/seed/blog1/400/250",
    imageHint: "futuristic writer desk",
    date: "October 23, 2023",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-5xl px-4 py-12">
          <div className="text-center mb-12">
            <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              The WriteBot AI Blog
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Tips, tutorials, and insights on how to get the most out of our AI-powered content creation tools.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {blogPosts.map((post) => (
              <Link href={post.href} key={post.title} className="group block">
                <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={post.imageHint}
                    />
                  </div>
                  <CardHeader>
                    <p className="text-sm text-muted-foreground">{post.date}</p>
                    <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3">{post.description}</CardDescription>
                     <div className="mt-4 flex items-center font-semibold text-primary">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
