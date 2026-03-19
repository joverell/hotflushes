import fs from "fs";
import path from "path";
import matter from "gray-matter";

const getPagesDirectory = () => {
  const primary = path.join(process.cwd(), "content/pages");
  const seed = path.join(process.cwd(), "content_seed/pages");
  
  if (fs.existsSync(primary) && fs.readdirSync(primary).some(f => f.endsWith('.md'))) {
    return primary;
  }
  
  console.log("Using SEED content directory (primary was missing or empty)");
  return seed;
};

const pagesDirectory = getPagesDirectory();

export interface PageData {
  slug: string;
  title: string;
  content: string;
  order: number;
  disabled?: boolean;
  [key: string]: any;
}

export function getPageBySlug(slug: string): PageData | null {
  try {
    const fullPath = path.join(pagesDirectory, `${slug}.md`);
    console.log(`Searching for page: ${slug} at ${fullPath}. Exists: ${fs.existsSync(fullPath)}`);
    if (!fs.existsSync(fullPath)) return null;
    
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      content,
      order: data.order ?? 99,
      disabled: data.disabled ?? false,
      ...data,
    };
  } catch (e) {
    return null;
  }
}

export function getAllPages(includeDisabled = false): PageData[] {
  if (!fs.existsSync(pagesDirectory)) return [];
  
  const fileNames = fs.readdirSync(pagesDirectory).filter(f => f.endsWith(".md"));
  const pages = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    return getPageBySlug(slug)!;
  });

  return pages
    .filter(p => includeDisabled || !p.disabled)
    .sort((a, b) => a.order - b.order);
}
