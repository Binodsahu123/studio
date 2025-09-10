import { PenTool } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto max-w-screen-2xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center space-x-2">
            <PenTool className="h-6 w-6 text-primary" />
            <span className="font-bold">WriteBot AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} WriteBot AI. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
