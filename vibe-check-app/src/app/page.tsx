"use client";

import { useState, useEffect } from "react";
import BrandProfilePanel, { BrandVoiceProfile } from "@/components/vibe-check/BrandProfilePanel";
import ResultCard, { CheckData } from "@/components/vibe-check/ResultCard";

const CONTENT_TYPES = [
  "Tweet",
  "LinkedIn",
  "TikTok script",
  "Ad copy",
  "Push Notification",
  "Custom"
];

const LOADING_PHRASES = [
  "Reading your copy...",
  "Scanning for corporate jargon...",
  "Running the feed test...",
  "De-cringing...",
  "Calibrating Hinglish tones...",
  "Writing brand-safe alternatives..."
];

export default function Home() {
  // Input states
  const [text, setText] = useState("");
  const [contentType, setContentType] = useState("Tweet");
  const [brandProfile, setBrandProfile] = useState<BrandVoiceProfile>({
    rules: "",
    posts: ["", "", ""],
    isActive: false
  });

  // Flow states
  const [loading, setLoading] = useState(false);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);
  const [result, setResult] = useState<CheckData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Rate limiting / Gate states
  const [checksCount, setChecksCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [submittingEmail, setSubmittingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // 1. Loading phrase interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // 2. Load rate limit states from local storage on mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const savedChecks = localStorage.getItem("vc_checks_today");
    if (savedChecks) {
      try {
        const { date, count } = JSON.parse(savedChecks);
        if (date === today) {
          setChecksCount(count);
        } else {
          // Reset for new day
          localStorage.setItem("vc_checks_today", JSON.stringify({ date: today, count: 0 }));
          setChecksCount(0);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem("vc_checks_today", JSON.stringify({ date: today, count: 0 }));
    }

    const savedEmailStatus = localStorage.getItem("vc_email_registered");
    if (savedEmailStatus) {
      setIsRegistered(savedEmailStatus === "true");
    }
  }, []);

  // 3. Trigger check
  const handleRunVibeCheck = async () => {
    if (!text.trim()) return;
    setError(null);

    // Verify rate limit locally first
    const limit = isRegistered ? 5 : 3;
    if (checksCount >= limit) {
      if (!isRegistered) {
        setShowEmailModal(true);
      } else {
        setShowPaywallModal(true);
      }
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          contentType,
          brandProfile: brandProfile.isActive ? brandProfile : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          // Rate limit exceeded
          setChecksCount(data.checksUsed || checksCount);
          if (data.emailRequired) {
            setShowEmailModal(true);
          } else {
            setShowPaywallModal(true);
          }
          throw new Error(data.message || "Rate limit exceeded.");
        } else if (data.error === "moderation_failed") {
          throw new Error(data.message);
        } else {
          throw new Error(data.message || "Something went wrong.");
        }
      }

      // Success
      setResult(data.check);
      
      // Update check count locally
      const today = new Date().toISOString().split("T")[0];
      const newCount = (data.checksUsed !== undefined) ? data.checksUsed : (checksCount + 1);
      setChecksCount(newCount);
      localStorage.setItem("vc_checks_today", JSON.stringify({ date: today, count: newCount }));

      // Scroll to result card
      setTimeout(() => {
        document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Submit Email for bonus checks
  const handleRegisterEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    if (!emailInput || !emailInput.includes("@")) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setSubmittingEmail(true);
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to register email.");
      }

      // Success
      setIsRegistered(true);
      localStorage.setItem("vc_email_registered", "true");
      setShowEmailModal(false);
      
      // Trigger vibe check again if email was captured during run
      if (text.trim()) {
        handleRunVibeCheck();
      }
    } catch (err: any) {
      setEmailError(err.message || "An error occurred.");
    } finally {
      setSubmittingEmail(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-6 py-12 flex flex-col gap-12">
      
      {/* 1. Header Navigation */}
      <header className="flex items-center justify-between py-2 border-b border-vc-border/50">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg tracking-tight text-vc-text select-none">
            vibe<span className="text-vc-accent">✓</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-vc-text-muted">
            {checksCount} / {isRegistered ? 5 : 3} free checks today
          </span>
          <button 
            onClick={() => setShowPaywallModal(true)}
            className="text-xs font-mono bg-vc-accent text-vc-text-inverse hover:bg-vc-accent-hover font-semibold px-3 py-1 rounded transition-colors uppercase tracking-wider"
          >
            Upgrade
          </button>
        </div>
      </header>

      {/* 2. Hero Header */}
      <section className="text-center md:text-left flex flex-col gap-3">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-vc-text">
          Pre-publish tone QA for Indian brands
        </h1>
        <p className="text-vc-text-muted text-base max-w-2xl leading-relaxed">
          Does your brand copy pass the Gen Z feed test? Catch cringe corporate hype, get specific issue quotes, and access clean brand-safe rewrites in 10 seconds.
        </p>
      </section>

      {/* 3. Main Workspace */}
      <main className="flex flex-col gap-6">
        
        {/* Editor Box */}
        <div className="border border-vc-border rounded-md bg-vc-bg-elevated p-5 flex flex-col gap-4 shadow-elevated">
          
          {/* Content Type Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-vc-text-muted uppercase tracking-wider text-left">
              Select Content Type
            </span>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  disabled={loading}
                  className={`px-3 py-1.5 rounded text-xs font-mono border transition-all ${
                    contentType === type
                      ? "bg-vc-text text-vc-text-inverse border-vc-text"
                      : "bg-transparent text-vc-text-muted border-vc-border hover:border-vc-text-muted hover:text-vc-text"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Copy Input Area */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-xs font-mono text-vc-text-muted uppercase tracking-wider text-left">
              Paste your draft copy
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
              placeholder="e.g. Say goodbye to dull skin! Unlock your true glow with our natural Face Wash containing 100% organic turmeric. Buy 1 Get 1 Free today only! Click link in bio to transform your skincare routine!"
              className="w-full min-h-[140px] bg-vc-bg border border-vc-border rounded p-4 text-sm text-vc-text placeholder-vc-text-secondary focus:outline-none focus:border-vc-neutral font-sans leading-relaxed resize-y vc-focus-ring"
            />
            {text.trim().length > 0 && (
              <span className="absolute bottom-3 right-3 text-[10px] font-mono text-vc-text-secondary">
                {text.length} chars
              </span>
            )}
          </div>

          {/* Brand Voice Profile Toggle Component */}
          <BrandProfilePanel onProfileChange={setBrandProfile} />

          {/* Run Actions */}
          <div className="flex items-center justify-between gap-4 border-t border-vc-border/50 pt-4 mt-1">
            <span className="text-[11px] font-mono text-vc-text-secondary text-left hidden sm:inline-block">
              * DeepSeek-V3 evaluates using Hinglish + local context
            </span>
            <button
              onClick={handleRunVibeCheck}
              disabled={loading || !text.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-vc-accent text-vc-text-inverse hover:bg-vc-accent-hover font-display font-semibold uppercase tracking-wider text-sm px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-vc-text-inverse" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{LOADING_PHRASES[loadingPhraseIndex]}</span>
                </>
              ) : (
                <>
                  <span>Run vibe check</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-[#ff5c4d]/10 border border-[#ff5c4d]/30 text-vc-accent rounded p-4 text-sm text-left flex gap-3 items-start animate-fade-in">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Output Results Section */}
        {result && (
          <div id="result-section" className="scroll-mt-12">
            <ResultCard data={result} onClose={() => setResult(null)} />
          </div>
        )}

      </main>

      {/* 4. Case Studies Section */}
      <section className="border-t border-vc-border/50 pt-12 flex flex-col gap-8 text-left">
        <div>
          <h2 className="font-display text-2xl font-bold text-vc-text">
            Teardowns from the Feed
          </h2>
          <p className="text-vc-text-muted text-sm mt-1">
            How real Indian brand campaigns score on Vibe Check.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="border border-vc-border rounded bg-vc-bg-elevated/40 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase bg-neutral-800 text-vc-text-muted px-2 py-0.5 rounded">
                D2C Beauty
              </span>
              <span className="text-xs font-mono text-vc-accent font-semibold">
                Score: 38 (Needs work)
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-vc-text-secondary uppercase">Original</span>
              <p className="text-xs text-vc-text-muted italic bg-vc-bg p-2.5 rounded border border-vc-border/40 leading-relaxed">
                "Say goodbye to dull skin! 🌟 Unlock your true glow with our natural Face Wash containing 100% organic turmeric. Buy 1 Get 1 Free today only!"
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-1">
              <span className="text-[10px] font-mono text-vc-pass uppercase font-medium">Fix Edit</span>
              <p className="text-xs text-vc-text bg-vc-pass/5 p-2.5 rounded border border-vc-pass/20 leading-relaxed font-medium">
                "Want healthier, glowing skin? Try our natural Face Wash with 100% organic turmeric. Special offer: Get a second bottle free today only."
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-vc-border rounded bg-vc-bg-elevated/40 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase bg-neutral-800 text-vc-text-muted px-2 py-0.5 rounded">
                EdTech Cohort
              </span>
              <span className="text-xs font-mono text-vc-accent font-semibold">
                Score: 30 (Hard cringe)
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-vc-text-secondary uppercase">Original</span>
              <p className="text-xs text-vc-text-muted italic bg-vc-bg p-2.5 rounded border border-vc-border/40 leading-relaxed">
                "We are thrilled to announce our new Data Science program, designed to synergize learning with industry. Unlock your potential and transition seamlessly..."
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-1">
              <span className="text-[10px] font-mono text-vc-pass uppercase font-medium">Fix Edit</span>
              <p className="text-xs text-vc-text bg-vc-pass/5 p-2.5 rounded border border-vc-pass/20 leading-relaxed font-medium">
                "We're launching a new Data Science course that blends hands-on learning with real industry projects. Step confidently into your next tech role today."
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border border-vc-border rounded bg-vc-bg-elevated/40 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase bg-neutral-800 text-vc-text-muted px-2 py-0.5 rounded">
                Quick Commerce
              </span>
              <span className="text-xs font-mono text-[#f5a623] font-semibold">
                Score: 50 (Needs work)
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-vc-text-secondary uppercase">Original</span>
              <p className="text-xs text-vc-text-muted italic bg-vc-bg p-2.5 rounded border border-vc-border/40 leading-relaxed">
                "🔥 FLASH SALE! 🔥 Get 50% flat off on all products for the next 15 minutes! Buy now or miss the biggest deal of the season!"
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-1">
              <span className="text-[10px] font-mono text-vc-pass uppercase font-medium">Fix Edit</span>
              <p className="text-xs text-vc-text bg-vc-pass/5 p-2.5 rounded border border-vc-pass/20 leading-relaxed font-medium">
                "Enjoy 50% off all items for the next 15 minutes. Check out before the flash sale ends."
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Footer */}
      <footer className="mt-12 pt-6 border-t border-vc-border/30 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-vc-text-secondary">
        <span>© 2026 vibecheck.in • All rights reserved</span>
        <div className="flex gap-4">
          <span className="select-none">We do not store your copy. We do not train models on your data.</span>
        </div>
      </footer>

      {/* 6. Email Gate Modal (P0 Rate Limit Trigger) */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#f5f2ec] text-[#0f0f12] rounded-md shadow-elevated border border-[#e8e4dc] p-6 max-w-sm w-full flex flex-col gap-5 text-left">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#5c5b66]">
                Free Checks Exhausted
              </span>
              <h3 className="font-display font-bold text-xl text-[#0f0f12] mt-1">
                Enter email for 2 bonus checks today
              </h3>
              <p className="text-xs text-[#5c5b66] mt-2 leading-relaxed">
                You have used your 3 free daily checks. Join our newsletter to receive 2 extra checks immediately. No credit card required.
              </p>
            </div>

            <form onSubmit={handleRegisterEmail} className="flex flex-col gap-3">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="e.g. you@company.com"
                className="w-full bg-white border border-[#e8e4dc] rounded px-3 py-2.5 text-sm text-[#0f0f12] placeholder-[#9b9aa8] focus:outline-none focus:border-[#0f0f12]"
              />
              {emailError && (
                <span className="text-xs text-[#ff5c4d] leading-normal">{emailError}</span>
              )}
              <div className="flex gap-3 justify-end items-center mt-2">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="text-xs font-mono font-medium uppercase tracking-wider text-[#5c5b66] hover:text-[#0f0f12] py-2 px-3 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEmail}
                  className="bg-[#0f0f12] text-white hover:bg-[#18181f] text-xs font-mono font-medium uppercase tracking-wider rounded px-5 py-2.5 transition-colors disabled:opacity-50"
                >
                  {submittingEmail ? "Submitting..." : "Get Bonus Checks"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Paywall Modal (P1 Stripe Trigger) */}
      {showPaywallModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#f5f2ec] text-[#0f0f12] rounded-md shadow-elevated border border-[#e8e4dc] p-6 max-w-sm w-full flex flex-col gap-5 text-left">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#5c5b66]">
                Upgrade to Pro
              </span>
              <h3 className="font-display font-bold text-xl text-[#0f0f12] mt-1">
                Unlimited Tone QA for Teams
              </h3>
              <p className="text-xs text-[#5c5b66] mt-2 leading-relaxed">
                You have reached your daily free checks limit. Upgrade to Pro for unlimited copy checks, brand profile saving, and history logs.
              </p>
            </div>

            <div className="flex flex-col gap-3 font-sans text-xs text-[#0f0f12] border-t border-b border-[#e8e4dc]/60 py-3">
              <div className="flex gap-2 items-center">
                <svg className="w-4 h-4 text-[#3ddba0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Unlimited copy checking (~500/mo fair use)</span>
              </div>
              <div className="flex gap-2 items-center">
                <svg className="w-4 h-4 text-[#3ddba0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save multiple custom brand voice profiles</span>
              </div>
              <div className="flex gap-2 items-center">
                <svg className="w-4 h-4 text-[#3ddba0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>30-day checks history and edit comparisons</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-mono text-[#5c5b66]">Pro Plan</span>
                <span className="text-lg font-display font-bold">$19/mo <span className="text-[10px] font-normal text-[#5c5b66]">or ₹1,499/mo</span></span>
              </div>
              <span className="text-[10px] text-vc-accent font-semibold uppercase tracking-wider">
                🎁 Early Bird: $9/mo for first 10 subscribers!
              </span>
            </div>

            <div className="flex gap-3 justify-end items-center mt-2">
              <button
                onClick={() => setShowPaywallModal(false)}
                className="text-xs font-mono font-medium uppercase tracking-wider text-[#5c5b66] hover:text-[#0f0f12] py-2 px-3 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  alert("Stripe Checkout will be active in days 11-14. For now, email us to join the early adopter list!");
                  setShowPaywallModal(false);
                }}
                className="bg-[#0f0f12] text-white hover:bg-[#18181f] text-xs font-mono font-medium uppercase tracking-wider rounded px-5 py-2.5 transition-colors"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
