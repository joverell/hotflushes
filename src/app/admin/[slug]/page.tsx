import fs from "fs";
import path from "path";
import PageEditor from "@/components/features/PageEditor";
import { notFound } from "next/navigation";

export default async function AdminEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pagesDirectory = path.join(process.cwd(), "content/pages");
  const filePath = path.join(pagesDirectory, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const initialContent = fs.readFileSync(filePath, "utf8");

  return (
    <div className="bg-muted/10 min-h-screen">
      <PageEditor slug={slug} initialContent={initialContent} />
    </div>
  );
}
