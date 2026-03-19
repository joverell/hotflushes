"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Post } from "@/lib/posts";

export function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
    >
      <div className="aspect-[16/9] overflow-hidden bg-muted">
        {/* Placeholder image logic or real image */}
        <div className="h-full w-full bg-primary/20 flex items-center justify-center text-accent font-serif text-xl italic">
          {post.title}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs font-medium text-accent uppercase tracking-wider mb-3">
          {post.category}
        </div>
        <h3 className="font-serif text-xl font-bold leading-tight mb-3 group-hover:text-accent transition-colors">
          <Link href={`/articles/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(post.date).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </span>
          </div>
          <Link 
            href={`/articles/${post.slug}`}
            className="flex items-center gap-1 text-accent font-medium hover:underline"
          >
            Read <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
