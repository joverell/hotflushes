import fs from "fs";
import path from "path";
import matter from "gray-matter";

const pagesDirectory = path.join(process.cwd(), "content/pages");

console.log("CWD:", process.cwd());
console.log("Pages Directory Path:", pagesDirectory);
console.log("Pages Directory Exists:", fs.existsSync(pagesDirectory));
if (fs.existsSync(pagesDirectory)) {
  console.log("Pages found:", fs.readdirSync(pagesDirectory));
}

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
