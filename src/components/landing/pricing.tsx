import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    title: "Monthly",
    price: "$29",
    period: "/month",
    description: "Perfect for individuals and small projects.",
    features: [
      "50,000 AI Words",
      "100 AI Images",
      "70+ Templates",
      "AI ChatBot Support",
      "Standard AI Models",
    ],
    cta: "Choose Monthly",
  },
  {
    title: "Yearly",
    price: "$299",
    period: "/year",
    description: "Best value for professionals and teams.",
    features: [
      "Unlimited AI Words",
      "1,000 AI Images/month",
      "All Advanced Features",
      "GPT-4o & DALL-E 3",
      "Priority Support",
    ],
    cta: "Choose Yearly",
    popular: true,
  },
  {
    title: "Lifetime",
    price: "$999",
    period: "one-time",
    description: "Pay once, use forever. The ultimate deal.",
    features: [
      "Everything in Yearly",
      "Lifetime Updates",
      "AI Fine-Tuning Access",
      "Early Access to New Features",
      "Dedicated Account Manager",
    ],
    cta: "Choose Lifetime",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-secondary py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-headline">
            Find the Perfect Plan for Your Needs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simple, transparent pricing. No hidden fees. Choose the plan that scales with you.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
          {pricingPlans.map((plan) => (
            <Card key={plan.title} className={`flex flex-col ${plan.popular ? 'border-primary ring-2 ring-primary' : ''}`}>
              {plan.popular && (
                <div className="py-1 px-4 bg-primary text-primary-foreground text-sm font-semibold rounded-t-lg -mt-px text-center">Most Popular</div>
              )}
              <CardHeader className="items-center text-center">
                <CardTitle>{plan.title}</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="ml-1 text-muted-foreground">{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Payment Gateways Supported: PayPal, Stripe, PayTM, Razorpay, and more.
        </p>
      </div>
    </section>
  );
}
