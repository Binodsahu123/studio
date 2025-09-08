import { BotMessageSquare, ImageIcon, LayoutTemplate, TrendingUp, ShieldCheck, Globe } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

const features = [
  {
    icon: <BotMessageSquare className="h-8 w-8 text-primary" />,
    title: "AI Content Generation",
    description: "Leverage cutting-edge models like GPT-4o to produce high-quality articles, marketing copy, and more.",
    href: "/write",
  },
  {
    icon: <ImageIcon className="h-8 w-8 text-primary" />,
    title: "AI Image Generation",
    description: "Create breathtaking visuals with Stable Diffusion & DALL-E, from text-to-image to image upscaling.",
    href: "/image",
  },
  {
    icon: <LayoutTemplate className="h-8 w-8 text-primary" />,
    title: "70+ Template Library",
    description: "Jumpstart your workflow with ready-made templates for blogs, social media, emails, and website content.",
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: "Multi-Language Support",
    description: "Generate content in unlimited languages, expanding your reach to a global audience with a single click.",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: "SEO Optimization",
    description: "Boost your search rankings with built-in tools that analyze and suggest improvements for your content.",
    href: "/seo",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Plagiarism & AI Detection",
    description: "Ensure content originality and authenticity with our advanced AI-powered plagiarism and content detectors.",
    href: "/detect",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-secondary py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-headline">
            Everything You Need, All in One Platform
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            WriteBot combines powerful AI tools into a seamless experience, empowering you to create at scale.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const cardContent = (
              <Card className="flex h-full flex-col items-start p-6 text-left transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                <CardHeader className="p-0">
                  {feature.icon}
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardDescription className="mt-2 text-base">
                  {feature.description}
                </CardDescription>
              </Card>
            );

            if (feature.href) {
              return (
                <Link href={feature.href} key={feature.title} className="block transition-transform duration-300 hover:-translate-y-2">
                  {cardContent}
                </Link>
              );
            }

            return <div key={feature.title} className="cursor-not-allowed">{cardContent}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
