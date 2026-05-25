import { Metadata } from "next";
import { getCheck } from "@/lib/storage";
import ResultCard from "@/components/vibe-check/ResultCard";
import Link from "next/link";
import { notFound } from "next/navigation";

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { id } = await params;
  const check = getCheck(id);
  
  if (!check) {
    return {
      title: "Report Not Found — Vibe Check",
    };
  }

  return {
    title: `Vibe Check Report (${check.verdict_label}) — vibecheck.in`,
    description: `Copy check result for ${check.contentType}. Tone verdict: ${check.verdict_label}.`,
    robots: {
      index: false, // Don't index shared links to protect brand copy privacy
      follow: false,
    }
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const check = getCheck(id);

  if (!check) {
    notFound();
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-6 py-12 flex flex-col gap-12 text-left">
      {/* Navigation Header */}
      <header className="flex items-center justify-between py-2 border-b border-vc-border/50">
        <Link href="/" className="font-display font-bold text-lg tracking-tight text-vc-text select-none">
          vibe<span className="text-vc-accent">✓</span>
        </Link>
        <Link 
          href="/"
          className="text-xs font-mono bg-vc-accent text-vc-text-inverse hover:bg-vc-accent-hover font-semibold px-4 py-2 rounded transition-colors uppercase tracking-wider"
        >
          Check Your Own Copy
        </Link>
      </header>

      {/* Main Report Area */}
      <main className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-bold text-vc-text">
            Shared Vibe Check Report
          </h1>
          <p className="text-xs text-vc-text-muted">
            Report generated on {new Date(check.timestamp).toLocaleDateString()} for brand copy review.
          </p>
        </div>
        
        {/* Render card */}
        <ResultCard data={check} isSharedView={true} />
      </main>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-vc-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-vc-text-secondary">
        <span>© 2026 vibecheck.in • Pre-publish Tone QA</span>
        <div className="flex gap-4">
          <span>We do not store your copy. We do not train models on your data.</span>
        </div>
      </footer>
    </div>
  );
}
