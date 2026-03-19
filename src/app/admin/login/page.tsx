"use client";

import * as React from "react";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, Home, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isPending, setIsPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.error || "Login failed");
    }
    setIsPending(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-primary/5">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-white rounded-2xl shadow-xl border mb-4">
            <Lock className="h-8 w-8 text-secondary" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-secondary">Admin Access</h1>
          <p className="text-muted-foreground mt-2 font-medium">Please enter your password to continue</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border shadow-xl shadow-secondary/5 border-secondary/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
              <input 
                type="password" 
                name="password"
                required
                autoFocus
                placeholder="••••••••••••"
                className="w-full px-5 py-4 rounded-xl border focus:ring-4 focus:ring-accent/10 outline-none transition-all border-secondary/10 hover:border-accent/40 focus:border-accent"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3 border border-red-100 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full h-14 rounded-xl bg-accent hover:bg-accent/90 text-white text-lg font-bold shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-dashed flex items-center justify-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-accent flex items-center gap-2 transition-colors">
              <Home className="h-4 w-4" />
              Back to site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
