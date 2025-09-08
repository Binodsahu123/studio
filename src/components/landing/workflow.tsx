import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const workflowSteps = [
  { name: "Keywords", description: "Generate SEO-friendly keywords." },
  { name: "Titles", description: "Create compelling headlines." },
  { name: "Images", description: "Produce unique article visuals." },
  { name: "Outline", description: "Structure your content perfectly." },
  { name: "Full Article", description: "Generate the complete blog post." },
];

export function Workflow() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-headline">
            From Idea to Published Article in Minutes
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Our intuitive full-blog workflow guides you through every step of content creation, making it faster and easier than ever.
          </p>
        </div>
        <div className="mt-16 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-0">
          {workflowSteps.map((step, index) => (
            <React.Fragment key={step.name}>
              <div className="flex flex-col items-center text-center max-w-[150px]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary">
                  <span className="text-xl font-bold">{index + 1}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              </div>
              {index < workflowSteps.length - 1 && (
                <ArrowRight className="h-8 w-8 text-muted-foreground/50 mx-4 my-4 md:my-0 rotate-90 md:rotate-0" />
              )}
            </React.Fragment>
          ))}
        </div>
        <Card className="mt-16 w-full max-w-4xl mx-auto shadow-xl">
          <CardContent className="p-2 sm:p-6">
            <Image
              src="https://picsum.photos/1024/512"
              alt="Article generation workflow UI"
              width={1024}
              height={512}
              className="rounded-md"
              data-ai-hint="workflow editor"
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}