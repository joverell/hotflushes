"use client";

import { getAllPages } from "@/lib/pages";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  FileText, 
  Settings, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown,
  Loader2
} from "lucide-react";
import * as React from "react";
import { 
  createPageAction, 
  deletePageAction, 
  togglePageDisabledAction, 
  updateOrderAction 
} from "../../app/admin/actions";
import { useRouter } from "next/navigation";
import { logoutAction } from "../../app/admin/login/actions";

import { MediaManager } from "./MediaManager";
import { LogOut } from "lucide-react";

export default function AdminDashboard({ pages }: { pages: any[] }) {
  const [activeTab, setActiveTab] = React.useState<'pages' | 'media'>('pages');
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newSlug, setNewSlug] = React.useState("");
  const [loadingSlug, setLoadingSlug] = React.useState<string | null>(null);
  const router = useRouter();

  async function handleLogout() {
    setIsLoggingOut(true);
    await logoutAction();
  }

  async function handleCreate() {
    if (!newTitle || !newSlug) return;
    setIsCreating(true);
    const result = await createPageAction(newTitle, newSlug);
    if (result.success) {
      setNewTitle("");
      setNewSlug("");
      router.refresh();
    } else {
      alert(result.error);
    }
    setIsCreating(false);
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Are you sure you want to delete "${slug}"?`)) return;
    setLoadingSlug(slug);
    await deletePageAction(slug);
    router.refresh();
    setLoadingSlug(null);
  }

  async function handleToggleStatus(slug: string, currentDisabled: boolean) {
    setLoadingSlug(slug);
    await togglePageDisabledAction(slug, !currentDisabled);
    router.refresh();
    setLoadingSlug(null);
  }

  async function handleMove(slug: string, currentOrder: number, direction: 'up' | 'down') {
    setLoadingSlug(slug);
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    await updateOrderAction(slug, newOrder);
    router.refresh();
    setLoadingSlug(null);
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b pb-8 gap-6">
        <div>
          <h1 className="font-serif text-4xl font-bold text-secondary">Site Administration</h1>
          <p className="text-muted-foreground mt-1">Manage your pages, visibility, and menu order</p>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="flex bg-muted p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('pages')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'pages' ? 'bg-white shadow-sm text-secondary' : 'text-muted-foreground hover:text-secondary'}`}
            >
              Pages
            </button>
            <button 
              onClick={() => setActiveTab('media')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'media' ? 'bg-white shadow-sm text-secondary' : 'text-muted-foreground hover:text-secondary'}`}
            >
              Media
            </button>
          </nav>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Sign Out"
          >
            {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {activeTab === 'pages' ? (
        <div className="space-y-12">
          {/* Create Page Section */}
          <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-2">
              <h3 className="font-bold text-secondary uppercase tracking-widest text-xs">New Content</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  placeholder="Page Title (e.g. Testimonials)"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    setNewSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''));
                  }}
                  className="px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-accent/20 outline-none text-sm flex-1"
                />
                <input 
                  placeholder="slug"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-accent/20 outline-none text-sm w-32 font-mono"
                />
              </div>
            </div>
            <Button onClick={handleCreate} disabled={isCreating} className="bg-accent hover:bg-accent/90 h-12 px-8 rounded-xl shadow-lg shadow-accent/20">
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Create Page
            </Button>
          </div>

          <div className="grid gap-6">
            {pages.map((page) => (
              <div 
                key={page.slug}
                className={`flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl border transition-all group relative overflow-hidden ${page.disabled ? 'bg-muted/30 border-dashed opacity-70' : 'bg-white shadow-sm hover:shadow-md'}`}
              >
                {loadingSlug === page.slug && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-accent" />
                  </div>
                )}

                <div className="flex items-center gap-6 mb-4 sm:mb-0">
                  <div className="flex flex-col items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-accent/10"
                      onClick={() => handleMove(page.slug, page.order, 'up')}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-bold text-muted-foreground">{page.order}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-accent/10"
                      onClick={() => handleMove(page.slug, page.order, 'down')}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/5 rounded-xl">
                      <FileText className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl font-bold text-secondary flex items-center gap-2">
                        {page.title}
                        {page.disabled && <span className="text-[10px] uppercase tracking-tighter bg-muted px-2 py-0.5 rounded italic">Hidden</span>}
                      </h2>
                      <p className="text-xs text-muted-foreground font-mono">/{page.slug}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`hover:bg-primary/10 ${page.disabled ? 'text-muted-foreground' : 'text-accent'}`}
                    title={page.disabled ? "Show in Menu" : "Hide from Menu"}
                    onClick={() => handleToggleStatus(page.slug, page.disabled)}
                  >
                    {page.disabled ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10"
                    title="Delete Page"
                    onClick={() => handleDelete(page.slug)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>

                  <div className="w-px h-8 bg-border mx-2" />

                  <Button variant="outline" className="rounded-xl border-accent/20 hover:border-accent hover:bg-accent/5 group-hover:text-accent" asChild>
                    <Link href={`/admin/${page.slug}`} className="flex items-center gap-2">
                      Edit Content <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <MediaManager />
      )}
    </div>
  );
}
