import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Branding */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="font-serif text-xl font-bold text-accent">
              The Hot Flushes
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Melbourne-based vocal quartet performing popular hits and show tunes from the 30s to the 70s since 2002.
            </p>
          </div>


          {/* Stay Connected */}
          <div className="flex flex-col gap-4 md:col-start-3 md:items-end md:text-right">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Follow Us</h3>
            <div className="flex gap-4 md:justify-end">
              <Link href="https://www.facebook.com/people/The-Hot-Flushes/61550829171204" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-6 w-6 text-muted-foreground hover:text-accent cursor-pointer transition-colors" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} The Hot Flushes Vocal Quartet. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
