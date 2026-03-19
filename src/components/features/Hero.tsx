"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export function Hero({ 
  title, 
  subtitle, 
  buttonText = "Book the Quartet", 
  buttonLink = "/contact",
  secondaryButtonText = "Upcoming Shows",
  secondaryButtonLink = "/performances"
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-transparent py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-7xl text-secondary mb-6 leading-tight whitespace-pre-line">
            {title || (
              <>
                The Hot Flushes <br />
                <span className="text-accent italic">Vocal Quartet</span>
              </>
            )}
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 font-medium whitespace-pre-line">
            {subtitle || (
              <>
                Bringing harmony, joy, and vintage classics to Melbourne and beyond since 2002. 
                From show tunes to popular hits of the 30s-70s.
              </>
            )}
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 bg-accent text-white hover:bg-accent/90" asChild>
              <Link href={buttonLink}>{buttonText}</Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 border-accent text-accent hover:bg-accent/5 backdrop-blur-sm" asChild>
              <Link href={secondaryButtonLink}>{secondaryButtonText}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
      {/* Decorative background elements */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
    </section>
  );
}
