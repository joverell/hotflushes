"use client";

import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { motion } from "framer-motion";
import Image from "next/image";

interface GalleryProps {
  content: string;
}

export function GalleryLightbox({ content }: GalleryProps) {
  const [index, setIndex] = React.useState(-1);

  // Extract images from markdown
  // Format: ![Alt](url)
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  const images: { src: string; alt: string }[] = [];
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    images.push({
      alt: match[1],
      src: match[2],
    });
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, i) => (
          <motion.div
            key={img.src}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-xl transition-all group"
            onClick={() => setIndex(i)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/20 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-secondary px-4 py-2 rounded-full font-medium text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                View Full Image
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={images.map(img => ({ src: img.src, alt: img.alt }))}
      />
    </div>
  );
}
