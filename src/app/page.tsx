import { Hero } from "@/components/features/Hero";
import Image from "next/image";
import { getPageBySlug } from "@/lib/pages";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function HomePage() {
  const page = getPageBySlug("home");
  const hero = page?.hero || {};
  const features = page?.features || [];

  return (
    <div className="relative flex flex-col gap-20 pb-20 overflow-hidden">
      {/* Faded Background Image */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <Image 
          src="/images/home-bg.jpg" 
          alt="Vintage Harmony Background" 
          fill 
          className="object-cover object-top filter grayscale"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col gap-20">
        <Hero 
          title={hero.title}
          subtitle={hero.subtitle}
          buttonText={hero.buttonText}
          buttonLink={hero.buttonLink}
        />

        {/* Quartet Features Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-secondary mb-4 underline decoration-accent/30 decoration-4 underline-offset-8">
              {page?.featuresTitle || "Harmonies for Every Occasion"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
              {page?.featuresSubtitle || "From private functions to grand stages, we provide high-quality vocal entertainment tailored to your event."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
            {features.map((feature: any, index: number) => (
              <div key={index} className="p-8 rounded-2xl bg-white/40 backdrop-blur-sm border border-primary/10 hover:shadow-lg transition-all duration-300">
                <h3 className="font-serif text-xl font-bold mb-4 text-secondary">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
            {features.length === 0 && (
              <>
                <div className="p-8 rounded-2xl bg-white/40 backdrop-blur-sm border border-primary/10 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-serif text-xl font-bold mb-4 text-secondary">Private Parties</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Birthdays, anniversaries, and family celebrations that need a touch of class and fun.</p>
                </div>
                <div className="p-8 rounded-2xl bg-white/40 backdrop-blur-sm border border-primary/10 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-serif text-xl font-bold mb-4 text-secondary">Community Events</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Festivals, local markets, and senior citizens' groups are our specialty and joy.</p>
                </div>
                <div className="p-8 rounded-2xl bg-white/40 backdrop-blur-sm border border-primary/10 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-serif text-xl font-bold mb-4 text-secondary">Corporate Functions</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Professional entertainment for product launches, gala dinners, and special occasions.</p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Additional Markdown Content */}
        {page?.content && page.content.trim() !== "" && (
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-primary/5">
            <div className="max-w-4xl mx-auto prose prose-lg prose-rose font-serif text-center md:text-left">
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{page.content}</ReactMarkdown>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
