"use client";

import { useState } from "react";
import ScoreRing from "./ScoreRing";
import VerdictBadge from "./VerdictBadge";

export interface CheckData {
  id: string;
  timestamp: string;
  contentType: string;
  originalText: string;
  score: number;
  verdict_band: "hard_cringe" | "needs_work" | "clean" | "fire";
  verdict_label: string;
  issues: string[];
  rewrite_fix: string;
  rewrite_genz: string;
}

interface ResultCardProps {
  data: CheckData;
  onClose?: () => void;
  isSharedView?: boolean;
}

export default function ResultCard({ data, onClose, isSharedView = false }: ResultCardProps) {
  const [activeTab, setActiveTab] = useState<"fix" | "genz">("fix");
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isPrivateShare, setIsPrivateShare] = useState(true);

  const activeRewrite = activeTab === "fix" ? data.rewrite_fix : data.rewrite_genz;

  const handleCopyRewrite = async () => {
    try {
      await navigator.clipboard.writeText(activeRewrite);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleCopyShareLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/share/${data.id}${isPrivateShare ? "?private=true" : ""}`;
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <div className="w-full bg-[#f5f2ec] text-[#0f0f12] rounded-md shadow-card border border-[#e8e4dc] overflow-hidden flex flex-col transition-all duration-300">
      {/* Top Bar / Header */}
      <div className="px-6 py-4 border-b border-[#e8e4dc] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#5c5b66]">
            QA Report • {data.contentType}
          </span>
        </div>
        {!isSharedView && onClose && (
          <button 
            onClick={onClose}
            className="text-[#5c5b66] hover:text-[#0f0f12] transition-colors p-1"
            title="Clear and check new copy"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Main Body Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
        
        {/* Left Column: Diagnostics */}
        <div className="flex flex-col items-center gap-6 justify-center border-b md:border-b-0 md:border-r border-[#e8e4dc] pb-6 md:pb-0 md:pr-8">
          <ScoreRing score={data.score} verdictBand={data.verdict_band} />
          <VerdictBadge verdictBand={data.verdict_band} label={data.verdict_label} />
        </div>

        {/* Right Column: Detailed Issues */}
        <div className="flex flex-col gap-6 text-left">
          <div>
            <h3 className="font-display font-semibold text-lg text-[#0f0f12] mb-1">
              Feedback Teardown
            </h3>
            <p className="text-xs text-[#5c5b66]">
              A pre-publish critique of how your phrasing lands.
            </p>
          </div>

          {/* Issues List */}
          <div className="flex flex-col gap-3">
            {data.issues.map((issue, idx) => {
              // Extract quote if it exists (usually in quotes)
              const parts = issue.split(" - ");
              const quote = parts[0];
              const explanation = parts.slice(1).join(" - ");

              return (
                <div key={idx} className="flex gap-3 items-start text-sm">
                  {/* Warning Dot */}
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff5c4d] mt-2 shrink-0" />
                  <div className="leading-relaxed">
                    {explanation ? (
                      <>
                        <span className="font-mono text-xs font-semibold bg-[#0f0f12]/5 px-1.5 py-0.5 rounded mr-1">
                          {quote}
                        </span>
                        <span className="text-[#0f0f12]">{explanation}</span>
                      </>
                    ) : (
                      <span className="text-[#0f0f12]">{issue}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rewrite Section */}
      <div className="px-6 pb-6 pt-2 border-t border-[#e8e4dc]">
        <div className="flex flex-col gap-4 text-left">
          
          {/* Rewrite Tabs */}
          <div className="flex items-center justify-between border-b border-[#e8e4dc] pb-2">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("fix")}
                className={`pb-1 text-sm font-display font-semibold border-b-2 transition-all ${
                  activeTab === "fix" 
                    ? "border-[#0f0f12] text-[#0f0f12]" 
                    : "border-transparent text-[#5c5b66] hover:text-[#0f0f12]"
                }`}
              >
                Fix Mode (De-cringe)
              </button>
              <button
                onClick={() => setActiveTab("genz")}
                className={`pb-1 text-sm font-display font-semibold border-b-2 transition-all ${
                  activeTab === "genz" 
                    ? "border-[#0f0f12] text-[#0f0f12]" 
                    : "border-transparent text-[#5c5b66] hover:text-[#0f0f12]"
                }`}
              >
                Gen Z Mode (Casual)
              </button>
            </div>
            
            {/* Copy Button */}
            <button
              onClick={handleCopyRewrite}
              className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#5c5b66] hover:text-[#0f0f12] transition-colors border border-[#5c5b66]/20 hover:border-[#0f0f12] rounded px-2.5 py-1 bg-white/50"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-[#3ddba0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Copy edit</span>
                </>
              )}
            </button>
          </div>

          {/* Rewrite Content Display */}
          <div className="bg-[#0f0f12]/5 border border-[#e8e4dc] rounded-md p-4 min-h-[80px]">
            <p className="text-sm font-sans leading-relaxed text-[#0f0f12] whitespace-pre-wrap">
              {activeRewrite}
            </p>
          </div>

          {/* Bottom Actions Area */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-2 border-t border-[#e8e4dc]/50 pt-4">
            
            {/* Share link type toggle (B2B Private vs Creator Public) */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#5c5b66]">
                Share Type:
              </span>
              <div className="flex border border-[#e8e4dc] rounded bg-white overflow-hidden p-0.5">
                <button
                  onClick={() => setIsPrivateShare(true)}
                  className={`text-[10px] uppercase tracking-wider font-mono px-2.5 py-1 rounded transition-colors ${
                    isPrivateShare 
                      ? "bg-[#0f0f12] text-white" 
                      : "text-[#5c5b66] hover:text-[#0f0f12]"
                  }`}
                >
                  Private (Unlisted)
                </button>
                <button
                  onClick={() => setIsPrivateShare(false)}
                  className={`text-[10px] uppercase tracking-wider font-mono px-2.5 py-1 rounded transition-colors ${
                    !isPrivateShare 
                      ? "bg-[#0f0f12] text-white" 
                      : "text-[#5c5b66] hover:text-[#0f0f12]"
                  }`}
                >
                  Public Card
                </button>
              </div>
            </div>

            {/* Share Trigger Action */}
            <button
              onClick={handleCopyShareLink}
              className="flex items-center justify-center gap-2 bg-[#0f0f12] text-[#f5f2ec] hover:bg-[#18181f] text-xs font-mono font-medium uppercase tracking-wider rounded px-5 py-2.5 transition-colors"
            >
              {shareCopied ? (
                <>
                  <svg className="w-4 h-4 text-[#3ddba0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l-1.928.964A1 1 0 006.316 13l3.368 1.684A1 1 0 0011 13.882V12h1v1.882a1 1 0 001.316.894l3.368-1.684a1 1 0 00.564-1.294l-1.928-.964A2 2 0 0116 9.258V8a2 2 0 00-2-2h-4a2 2 0 00-2 2v1.258a2 2 0 01-.316 1.484z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742A2 2 0 019.258 9H11V8a3 3 0 016 0v1h.742a2 2 0 011.928 2.506l-1.928.964A3 3 0 0017 14.882V16a3 3 0 01-6 0v-1H9.258a2 2 0 01-1.928-2.506l1.928-.964z" />
                  </svg>
                  <span>Copy Share Link</span>
                </>
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
