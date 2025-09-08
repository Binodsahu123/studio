import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Cta() {
  return (
    <section className="bg-secondary">
      <div className="container mx-auto px-4 py-20 text-center sm:py-24">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl font-headline">
          Ready to Boost Your Content Strategy?
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
          Join thousands of creators, marketers, and developers who are saving time and scaling their content with WriteBot AI.
        </p>
        <div className="mt-8">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg h-auto py-4 px-8">
            Start Generating Content in Seconds
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
