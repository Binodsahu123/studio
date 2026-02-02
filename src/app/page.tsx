// This page is now public and does not require activation.
// We are redirecting to the main generation page if activated, 
// or it will be handled by the general flow.
// For simplicity, we can keep the landing page public.

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Workflow } from "@/components/landing/workflow";
import { Benefits } from "@/components/landing/benefits";
import { UiShowcase } from "@/components/landing/ui-showcase";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { Cta } from "@/components/landing/cta";
import { Tools } from "@/components/landing/tools";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <Workflow />
        <Benefits />
        <Tools />
        <UiShowcase />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
