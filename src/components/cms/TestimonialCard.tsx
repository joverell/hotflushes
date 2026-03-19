"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

interface TestimonialProps {
  quote: string;
  author: string;
  position?: string;
  location?: string;
  date?: string;
  image?: string;
  index: number;
}

export function TestimonialCard({ 
  quote, 
  author, 
  position, 
  location, 
  date, 
  image, 
  index 
}: TestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative overflow-hidden rounded-3xl bg-secondary/5 p-6 md:p-8 border border-secondary/10 hover:border-accent/30 transition-colors duration-300"
    >
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
        <div className="flex-grow space-y-4">
          <Quote className="h-8 w-8 text-accent/20 rotate-180" strokeWidth={3} />
          
          <p className="font-serif text-lg leading-relaxed text-secondary italic">
            {quote}
          </p>

          <div className="space-y-0.5">
            <h4 className="text-secondary font-bold text-base md:text-lg">
              {author} {position ? `| ${position}` : ''}
            </h4>
            <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {location} {date ? `• ${date}` : ''}
            </div>
            <div className="h-1 w-10 bg-accent/40 rounded-full mt-3" />
          </div>
        </div>

        {image && (
          <div className="flex-shrink-0 relative hidden md:block">
            <div className="h-28 w-28 md:h-32 md:w-32 rounded-full border-2 border-accent/20 overflow-hidden shadow-lg transition-transform duration-500 hover:scale-105">
              <Image 
                src={image} 
                alt={author} 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
