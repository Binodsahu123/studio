import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenTool, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const navLinks = [
    { href: "/write", label: "Write Content" },
    { href: "/rewrite", label: "Rewrite Content" },
    { href: "/remix", label: "Article Mixer" },
    { href: "/html-converter", label: "HTML Converter" },
    { href: "/keywords", label: "Keyword Ideas" },
    { href: "/seo", label: "Advanced SEO Analyzer" },
    { href: "/image", label: "Image Generation" },
    { href: "/voiceover", label: "Voiceover" },
    { href: "/hashtag", label: "Hashtag Generator" },
    { href: "/seo-assets", label: "SEO Assets Generator" },
    { href: "/detect", label: "AI Detector" },
    { href: "/#faq", label: "Support" },
    { href: "/#features", label: "Features" },
    { href: "/payment", label: "Pricing" },
    { href: "/blog", label: "Blog" },
];

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
          <nav className="hidden items-center space-x-1 md:flex">
            {navLinks.map((link) => (
                <Button key={link.href} asChild variant="ghost">
                    <Link href={link.href}>{link.label}</Link>
                </Button>
            ))}
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/generate">Start Creating</Link>
            </Button>
          </nav>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                 <SheetHeader>
                    <SheetTitle>
                        <Link href="/" className="flex items-center space-x-2">
                            <PenTool className="h-6 w-6 text-primary" />
                            <span className="font-bold">WriteBot AI</span>
                        </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-8rem)]">
                    <div className="flex flex-col space-y-2 px-4 py-6">
                        {navLinks.map((link) => (
                            <SheetClose asChild key={link.href}>
                                <Link href={link.href} className="block px-4 py-2 text-base text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md">
                                    {link.label}
                                </Link>
                            </SheetClose>
                        ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 absolute bottom-0 w-[calc(100%-2rem)]">
                    <SheetClose asChild>
                        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 w-full">
                            <Link href="/generate">Start Creating Today</Link>
                        </Button>
                    </SheetClose>
                  </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
