"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { 
  uploadImageAction, 
  getMediaAction, 
  deleteMediaAction, 
  createFolderAction 
} from "../../app/admin/actions";
import { 
  Upload, 
  Folder, 
  FolderPlus, 
  ChevronRight, 
  Home, 
  Trash2, 
  Copy, 
  Check, 
  Loader2, 
  ImageIcon, 
  MoreVertical,
  ArrowLeft
} from "lucide-react";
import Image from "next/image";

export function MediaManager() {
  const [items, setItems] = React.useState<any[]>([]);
  const [currentPath, setCurrentPath] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCreatingFolder, setIsCreatingFolder] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const [copiedPath, setCopiedPath] = React.useState<string | null>(null);
  const [deletingPath, setDeletingPath] = React.useState<string | null>(null);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchMedia = React.useCallback(async (path: string) => {
    setIsLoading(true);
    const result = await getMediaAction(path);
    if (result.success) {
      setItems(result.items || []);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    fetchMedia(currentPath);
  }, [currentPath, fetchMedia]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImageAction(formData, currentPath);
    if (result.success) {
      await fetchMedia(currentPath);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      alert(result.error);
    }
    setIsUploading(false);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName) return;
    const result = await createFolderAction(currentPath, newFolderName);
    if (result.success) {
      setNewFolderName("");
      setIsCreatingFolder(false);
      await fetchMedia(currentPath);
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (relativePath: string) => {
    if (!confirm(`Are you sure you want to delete "${relativePath}"? This cannot be undone.`)) return;
    setDeletingPath(relativePath);
    const result = await deleteMediaAction(relativePath);
    if (result.success) {
      await fetchMedia(currentPath);
    } else {
      alert(result.error);
    }
    setDeletingPath(null);
  };

  const copyToClipboard = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const navigateTo = (path: string) => {
    setCurrentPath(path);
  };

  const breadcrumbs = currentPath.split("/").filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Media Header & Breadcrumbs */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-secondary">Media Explorer</h2>
            <p className="text-muted-foreground text-sm mt-1">Manage all images and folders in your project.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsCreatingFolder(true)}
              className="rounded-xl"
            >
              <FolderPlus className="h-4 w-4 mr-2" /> New Folder
            </Button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleUpload}
              className="hidden"
              accept="image/*"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={isUploading}
              className="bg-accent hover:bg-accent/90 text-white rounded-xl shadow-lg shadow-accent/20"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Upload Image
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg border overflow-x-auto whitespace-nowrap">
          <button 
            onClick={() => navigateTo("")}
            className={`flex items-center gap-1 hover:text-accent transition-colors ${currentPath === "" ? "font-bold text-accent" : "text-muted-foreground"}`}
          >
            <Home className="h-4 w-4" /> root
          </button>
          {breadcrumbs.map((crumb, i) => {
            const path = breadcrumbs.slice(0, i + 1).join("/");
            return (
              <React.Fragment key={path}>
                <ChevronRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                <button 
                  onClick={() => navigateTo(path)}
                  className={`hover:text-accent transition-colors ${i === breadcrumbs.length - 1 ? "font-bold text-accent" : "text-muted-foreground"}`}
                >
                  {crumb}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* New Folder Modal-like Overlay */}
      {isCreatingFolder && (
        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">New Folder Name</label>
            <input 
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              placeholder="e.g. gallery-2024"
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-accent/20 outline-none"
            />
          </div>
          <div className="flex gap-2 shrink-0 self-end sm:self-center">
            <Button variant="ghost" onClick={() => setIsCreatingFolder(false)}>Cancel</Button>
            <Button onClick={handleCreateFolder} className="bg-accent text-white rounded-xl">Create Folder</Button>
          </div>
        </div>
      )}

      {/* Media Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-accent" />
          <p className="text-muted-foreground font-medium italic">Scanning directories...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-3xl bg-muted/5 gap-4">
          <div className="p-4 bg-white rounded-full border shadow-sm text-muted-foreground/30">
            <ImageIcon className="h-8 w-8" />
          </div>
          <p className="text-muted-foreground">This folder is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {items.map((item, index) => (
            <div key={item.path} className="group relative bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col animate-in fade-in zoom-in-95 duration-200">
              {deletingPath === item.path && (
                <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-destructive" />
                </div>
              )}

              {item.type === 'directory' ? (
                <button 
                  onClick={() => navigateTo(item.path)}
                  className="aspect-square flex flex-col items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors gap-2"
                >
                  <Folder className="h-12 w-12 text-accent fill-accent/20" />
                  <span className="text-xs font-bold text-secondary uppercase tracking-tight">{item.name}</span>
                </button>
              ) : (
                <div className="aspect-square relative bg-muted/20">
                  <Image 
                    src={item.url} 
                    alt={item.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Overlay Actions */}
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="h-9 w-9 rounded-full shadow-xl bg-red-600 hover:bg-red-700 text-white border-2 border-white/20"
                  onClick={() => handleDelete(item.path)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {item.type === 'file' && (
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className={`h-9 w-9 rounded-full shadow-xl border-2 border-white/20 ${copiedPath === item.url ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white text-accent hover:bg-white/90'}`}
                    onClick={() => copyToClipboard(item.url)}
                  >
                    {copiedPath === item.url ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </div>

              <div className="p-3 border-t bg-white">
                <p className="text-[10px] font-mono text-muted-foreground truncate" title={item.name}>{item.name}</p>
                {item.type === 'file' && (
                  <p className="text-[9px] mt-0.5 text-accent/60 font-medium truncate">{item.url}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helpful Hint */}
      <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100 flex gap-4">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-sky-100 hidden sm:block">
          <ImageIcon className="h-6 w-6 text-sky-600" />
        </div>
        <div className="text-xs sm:text-sm">
          <h4 className="font-bold text-sky-900">Pro Tip</h4>
          <p className="text-sky-700/80 mt-1 leading-relaxed">
            Organize your media into folders like <code className="bg-sky-200/50 px-1 rounded">/gallery</code> or <code className="bg-sky-200/50 px-1 rounded">/albums</code>. 
            All paths are relative to the root images folder. Copy a path and paste it into any "Hero Image" or "Feature Image" field.
          </p>
        </div>
      </div>
    </div>
  );
}
