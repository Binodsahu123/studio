import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenTool } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <PenTool className="h-6 w-6 text-primary" />
            <span className="font-bold">WriteBot AI</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden items-center space-x-2 md:flex">
            <Button asChild variant="ghost">
                <Link href="/#features">Features</Link>
            </Button>
            <Button asChild variant="ghost">
                <Link href="/#pricing">Pricing</Link>
            </Button>
            <Button asChild variant="ghost">
                <Link href="/write">Write Content</Link>
            </Button>
            <Button asChild variant="ghost">
                <Link href="/#faq">Support</Link>
            </Button>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/generate">Start Creating Today</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
