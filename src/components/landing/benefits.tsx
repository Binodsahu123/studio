import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const benefits = [
  { title: "Increase Productivity", description: "Generate content 10x faster and focus on strategy." },
  { title: "Reduce Costs", description: "Slash your content creation budget without sacrificing quality." },
  { title: "Ensure Consistency", description: "Maintain a consistent brand voice and style across all content." },
  { title: "Scale Content Effortlessly", description: "Produce vast amounts of content for multiple channels and languages." },
  { title: "Boost SEO Performance", description: "Create optimized content that ranks higher and drives organic traffic." },
  { title: "Unlock Creativity", description: "Overcome writer's block with fresh ideas and diverse content formats." },
];

export function Benefits() {
  return (
    <section className="bg-secondary py-20 sm:py-32">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 md:grid-cols-2 md:items-center">
        <div className="space-y-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-headline">
            Transform Your Content Strategy with the Power of AI
          </h2>
          <p className="text-lg text-muted-foreground">
            WriteBot isn't just a tool; it's your strategic partner in content creation. Go beyond simple writing and unlock unprecedented efficiency, creativity, and growth.
          </p>
          <ul className="space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit.title} className="flex items-start">
                <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                <div className="ml-3">
                  <h4 className="font-semibold">{benefit.title}</h4>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-[500px] w-full">
            <Image
              src="https://picsum.photos/600/700"
              alt="AI benefits illustration"
              fill
              className="rounded-lg object-cover shadow-lg"
              data-ai-hint="abstract geometric"
            />
        </div>
      </div>
    </section>
  );
}
