import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="container mx-auto flex flex-col items-center px-4 py-20 text-center sm:py-32">
      <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
        Generate High-Quality AI Content, Images, and Code Instantly.
      </h1>
      <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
        Unleash your creativity with WriteBot. Our advanced AI platform helps you craft compelling articles, generate stunning visuals, and write clean code in seconds. Supercharge your content strategy today.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/generate">
            Start for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="#features">
            See Features
          </Link>
        </Button>
      </div>
      <div className="relative mt-16 w-full max-w-5xl">
        <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-primary to-accent opacity-20 blur-3xl"></div>
        <Image
          src="https://picsum.photos/1200/600"
          alt="WriteBot AI Dashboard"
          width={1200}
          height={600}
          className="relative rounded-lg border shadow-2xl"
          data-ai-hint="dashboard SaaS"
        />
      </div>
    </section>
  );
}
