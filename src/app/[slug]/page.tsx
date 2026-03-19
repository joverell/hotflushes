import { getPageBySlug } from "@/lib/pages";
import { notFound } from "next/navigation";
import { PageContent } from "@/components/features/PageContent";
import { GalleryLightbox } from "@/components/features/GalleryLightbox";
import { TestimonialCard } from "@/components/cms/TestimonialCard";

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log(`[REQUEST] Attempting to load slug: ${slug}`);
  const page = getPageBySlug(slug);
  console.log(`[REQUEST] Result for ${slug}: ${page ? 'FOUND' : 'NOT FOUND'}`);

  if (!page) {
    notFound();
  }

  // Check if this is a gallery page
  if (page.type === "gallery" || slug === "gallery") {
    return (
      <div className="pb-20">
        <header className="bg-primary/5 py-16 mb-12 border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl text-secondary mb-4">
              {page.title}
            </h1>
            <div className="h-1 w-20 bg-accent rounded-full" />
          </div>
        </header>
        <GalleryLightbox content={page.content} />
      </div>
    );
  }

  // Check if this is a testimonials page
  if (page.type === "testimonials" || slug === "testimonials") {
    const testimonials = page.testimonials || [];
    return (
      <div className="pb-20">
        <header className="bg-primary/5 py-16 mb-12 border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl text-secondary mb-4">
              {page.title}
            </h1>
            <div className="h-1 w-20 bg-accent rounded-full" />
          </div>
        </header>
        
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="mb-12 text-lg text-muted-foreground leading-relaxed italic border-l-4 border-accent/20 pl-6">
            "We've been blessed to share our music with so many wonderful people across Melbourne. Here are a few kind words they've shared with us."
          </p>
          
          <div className="space-y-12">
            {testimonials.map((t: any, i: number) => (
              <TestimonialCard key={i} {...t} index={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <PageContent title={page.title} content={page.content} />;
}
