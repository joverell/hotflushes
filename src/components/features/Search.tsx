"use client";

import * as React from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function Search() {
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/articles?search=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative group">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles..."
        className="h-10 w-full rounded-full border border-input bg-background/50 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:bg-background transition-all md:w-64"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </form>
  );
}
