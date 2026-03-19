"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { savePageAction } from "../../app/admin/actions";
import { ArrowLeft, Save, Loader2, Settings, FileText, Plus, Trash2, MoveUp, MoveDown, User, Quote, MapPin } from "lucide-react";
import Link from "next/link";
import { EditorWrapper } from "../cms/EditorWrapper";
import matter from "gray-matter";

interface EditorProps {
  slug: string;
  initialContent: string;
}

export default function PageEditor({ slug, initialContent }: EditorProps) {
  // Parse frontmatter once on initialization
  const parsed = React.useMemo(() => matter(initialContent), [initialContent]);
  
  const [markdown, setMarkdown] = React.useState(parsed.content);
  const [metadata, setMetadata] = React.useState(parsed.data);
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    
    // Re-combine metadata and markdown
    const finalContent = matter.stringify(markdown, metadata);
    const result = await savePageAction(slug, finalContent);
    
    if (result.success) {
      setMessage({ type: "success", text: "Page saved successfully!" });
      router.refresh();
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save" });
    }
    
    setIsSaving(false);
  }

  const handleMetadataChange = (key: string, value: any) => {
    setMetadata(prev => ({ ...prev, [key]: value }));
  };

  const handleTestimonialChange = (index: number, field: string, value: any) => {
    const newTestimonials = [...(metadata.testimonials || [])];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    handleMetadataChange("testimonials", newTestimonials);
  };

  const addTestimonial = () => {
    const newTestimonials = [...(metadata.testimonials || []), { quote: "", author: "" }];
    handleMetadataChange("testimonials", newTestimonials);
  };

  const removeTestimonial = (index: number) => {
    const newTestimonials = (metadata.testimonials || []).filter((_: any, i: number) => i !== index);
    handleMetadataChange("testimonials", newTestimonials);
  };

  const moveTestimonial = (index: number, direction: 'up' | 'down') => {
    const newTestimonials = [...(metadata.testimonials || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newTestimonials.length) return;
    
    [newTestimonials[index], newTestimonials[targetIndex]] = [newTestimonials[targetIndex], newTestimonials[index]];
    handleMetadataChange("testimonials", newTestimonials);
  };

  const isTestimonialsPage = metadata.type === "testimonials" || slug.toLowerCase() === "testimonials";
  const isHomePage = metadata.type === "home" || slug === "home";

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <nav className="mb-8">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Back to Admin
          </Link>
        </Button>
      </nav>

      <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 border-b pb-8">
        <div>
          <div className="flex items-center gap-2 text-accent mb-2">
            <Settings className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Editor Mode</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-secondary">Editing: {metadata.title || slug}</h1>
          <p className="text-muted-foreground mt-1">Manage page settings and {isTestimonialsPage ? "testimonials" : isHomePage ? "home content" : "content"} separately.</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          {message && (
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message.text}
            </span>
          )}
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-accent hover:bg-accent/90 text-white min-w-[140px] shadow-lg shadow-accent/20 h-11"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar: Page Settings */}
        <aside className="lg:col-span-1 space-y-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <Settings className="h-4 w-4" /> Page Settings
            </h3>
            
            <div className="space-y-5 p-6 bg-white rounded-2xl border shadow-sm">
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary uppercase">Page Title</label>
                <input 
                  type="text" 
                  value={metadata.title || ""} 
                  onChange={(e) => handleMetadataChange("title", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  placeholder="e.g. About Us"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary uppercase">Menu Order</label>
                <input 
                  type="number" 
                  value={metadata.order || 0} 
                  onChange={(e) => handleMetadataChange("order", parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                />
                <p className="text-[10px] text-muted-foreground italic">Lower numbers appear first in the menu.</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="disabled-toggle"
                  checked={metadata.disabled === true} 
                  onChange={(e) => handleMetadataChange("disabled", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                />
                <label htmlFor="disabled-toggle" className="text-sm font-medium text-secondary cursor-pointer">
                  Hide from menu
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Editor Area */}
        <main className="lg:col-span-3 space-y-8">
          {isHomePage ? (
            <div className="space-y-12">
              {/* Hero Section Editor */}
              <section className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 border-b pb-2">
                  <Quote className="h-4 w-4" /> Hero Section
                </h3>
                <div className="grid grid-cols-1 gap-6 p-6 bg-white rounded-2xl border shadow-sm">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-secondary uppercase">Hero Title</label>
                    <textarea 
                      value={metadata.hero?.title || ""} 
                      onChange={(e) => handleMetadataChange("hero", { ...metadata.hero, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-accent/20 outline-none transition-all font-serif text-lg"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-secondary uppercase">Hero Subtitle</label>
                    <textarea 
                      value={metadata.hero?.subtitle || ""} 
                      onChange={(e) => handleMetadataChange("hero", { ...metadata.hero, subtitle: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Button Text</label>
                      <input 
                        type="text" 
                        value={metadata.hero?.buttonText || ""} 
                        onChange={(e) => handleMetadataChange("hero", { ...metadata.hero, buttonText: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Button Link</label>
                      <input 
                        type="text" 
                        value={metadata.hero?.buttonLink || ""} 
                        onChange={(e) => handleMetadataChange("hero", { ...metadata.hero, buttonLink: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Features Section Editor */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Features Section
                  </h3>
                </div>
                <div className="space-y-6 p-6 bg-white rounded-2xl border shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-secondary uppercase">Section Title</label>
                      <input 
                        type="text" 
                        value={metadata.featuresTitle || ""} 
                        onChange={(e) => handleMetadataChange("featuresTitle", e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-accent/20 outline-none transition-all font-serif"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-secondary uppercase">Section Subtitle</label>
                      <input 
                        type="text" 
                        value={metadata.featuresSubtitle || ""} 
                        onChange={(e) => handleMetadataChange("featuresSubtitle", e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-secondary uppercase">Individual Features</label>
                      <Button variant="ghost" size="sm" onClick={() => {
                        const newFeatures = [...(metadata.features || []), { title: "", description: "" }];
                        handleMetadataChange("features", newFeatures);
                      }} className="h-7 text-accent hover:bg-accent/5">
                        <Plus className="h-3 w-3 mr-1" /> Add Feature
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(metadata.features || []).map((feature: any, i: number) => (
                        <div key={i} className="p-4 rounded-xl border bg-muted/5 space-y-3 relative group">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border shadow-sm text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newFeatures = metadata.features.filter((_: any, idx: number) => idx !== i);
                              handleMetadataChange("features", newFeatures);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <input 
                            type="text" 
                            value={feature.title} 
                            onChange={(e) => {
                              const newFeatures = [...metadata.features];
                              newFeatures[i] = { ...newFeatures[i], title: e.target.value };
                              handleMetadataChange("features", newFeatures);
                            }}
                            className="w-full px-2 py-1 bg-transparent border-b border-transparent focus:border-accent outline-none font-bold text-sm"
                            placeholder="Feature Title"
                          />
                          <textarea 
                            value={feature.description} 
                            onChange={(e) => {
                              const newFeatures = [...metadata.features];
                              newFeatures[i] = { ...newFeatures[i], description: e.target.value };
                              handleMetadataChange("features", newFeatures);
                            }}
                            className="w-full px-2 py-1 bg-transparent border rounded-md border-transparent focus:border-accent outline-none text-xs min-h-[60px]"
                            placeholder="Description..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Extra Content */}
              <section className="space-y-4 pt-8 border-t">
                 <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Additional Home Content (Markdown)
                </h3>
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden min-h-[300px] flex flex-col">
                  <EditorWrapper markdown={markdown} onChange={setMarkdown} />
                </div>
              </section>
            </div>
          ) : isTestimonialsPage ? (
            <div className="space-y-12">
              <div className="space-y-4">
                 <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Intro/Footer Content (Markdown)
                </h3>
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden min-h-[300px] flex flex-col">
                  <EditorWrapper markdown={markdown} onChange={setMarkdown} />
                </div>
              </div>

              <div className="pt-8 border-t space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" /> Manage Testimonials
                  </h3>
                  <Button variant="outline" size="sm" onClick={addTestimonial} className="rounded-xl border-accent/20 hover:bg-accent/5">
                    <Plus className="h-4 w-4 mr-2" /> Add Testimonial
                  </Button>
                </div>

                <div className="space-y-6">
                  {(metadata.testimonials || []).map((t: any, i: number) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm space-y-4 group transition-all hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Quote className="h-4 w-4 text-accent" />
                          <span className="text-xs font-bold uppercase">Testimonial #{i + 1}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveTestimonial(i, 'up')} disabled={i === 0}>
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveTestimonial(i, 'down')} disabled={i === (metadata.testimonials?.length - 1)}>
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeTestimonial(i)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <textarea 
                        value={t.quote} 
                        onChange={(e) => handleTestimonialChange(i, "quote", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-accent/20 outline-none transition-all min-h-[100px] text-serif"
                        placeholder="The testimonial quote..."
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Author</label>
                          <input 
                            type="text" 
                            value={t.author || ""} 
                            onChange={(e) => handleTestimonialChange(i, "author", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                            placeholder="Name of the person/group"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Position / Role</label>
                          <input 
                            type="text" 
                            value={t.position || ""} 
                            onChange={(e) => handleTestimonialChange(i, "position", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                            placeholder="e.g. Event Coordinator"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Location / Venue</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input 
                              type="text" 
                              value={t.location || ""} 
                              onChange={(e) => handleTestimonialChange(i, "location", e.target.value)}
                              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                              placeholder="e.g. Rippon Lea Estate"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Date</label>
                          <input 
                            type="text" 
                            value={t.date || ""} 
                            onChange={(e) => handleTestimonialChange(i, "date", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                            placeholder="e.g. December 2018"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Page Content
                </h3>
                <span className="text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded font-bold uppercase tracking-tighter">Markdown Enabled</span>
              </div>
              
              <div className="bg-white rounded-2xl border shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                <EditorWrapper markdown={markdown} onChange={setMarkdown} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
