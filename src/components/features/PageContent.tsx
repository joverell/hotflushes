"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface PageContentProps {
  title: string;
  content: string;
}

export function PageContent({ title, content }: PageContentProps) {
  return (
    <article className="pb-20">
      <header className="bg-primary/5 py-16 mb-12 border-b">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl font-bold tracking-tight sm:text-5xl text-secondary mb-4"
          >
            {title}
          </motion.h1>
          <div className="h-1 w-20 bg-accent rounded-full" />
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg prose-rose font-serif max-w-none"
        >
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
        </motion.div>
      </div>
    </article>
  );
}
