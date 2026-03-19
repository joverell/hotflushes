"use client";

import dynamic from "next/dynamic";
import * as React from "react";

const MDXEditor = dynamic(() => import("./MDXEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[70vh] w-full flex items-center justify-center bg-muted/5 border rounded-xl animate-pulse">
      <p className="text-muted-foreground font-serif italic text-lg">Loading Editor...</p>
    </div>
  ),
});

interface EditorWrapperProps {
  markdown: string;
  onChange: (markdown: string) => void;
}

export function EditorWrapper({ markdown, onChange }: EditorWrapperProps) {
  return <MDXEditor markdown={markdown} onChange={onChange} />;
}
