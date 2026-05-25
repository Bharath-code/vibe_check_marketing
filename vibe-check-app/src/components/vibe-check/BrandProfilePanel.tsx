"use client";

import { useState, useEffect } from "react";

export interface BrandVoiceProfile {
  posts: string[];
  rules: string;
  isActive: boolean;
}

interface BrandProfilePanelProps {
  onProfileChange: (profile: BrandVoiceProfile) => void;
}

export default function BrandProfilePanel({ onProfileChange }: BrandProfilePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [rules, setRules] = useState("");
  const [posts, setPosts] = useState<string[]>(["", "", ""]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vc_brand_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        setRules(parsed.rules || "");
        setPosts(parsed.posts || ["", "", ""]);
        setIsActive(parsed.isActive || false);
        onProfileChange({
          rules: parsed.rules || "",
          posts: parsed.posts || ["", "", ""],
          isActive: parsed.isActive || false,
        });
      }
    } catch (e) {
      console.error("Error loading brand profile", e);
    }
  }, []);

  const saveProfile = (newIsActive: boolean, newRules: string, newPosts: string[]) => {
    const profile = { rules: newRules, posts: newPosts, isActive: newIsActive };
    localStorage.setItem("vc_brand_profile", JSON.stringify(profile));
    onProfileChange(profile);
  };

  const handleToggleActive = () => {
    const nextActive = !isActive;
    setIsActive(nextActive);
    saveProfile(nextActive, rules, posts);
  };

  const handleRulesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextRules = e.target.value;
    setRules(nextRules);
    saveProfile(isActive, nextRules, posts);
  };

  const handlePostChange = (index: number, val: string) => {
    const nextPosts = [...posts];
    nextPosts[index] = val;
    setPosts(nextPosts);
    saveProfile(isActive, rules, nextPosts);
  };

  return (
    <div className="w-full border border-vc-border rounded-md bg-vc-bg-elevated/40 overflow-hidden transition-all duration-200">
      {/* Header Bar */}
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <svg 
            className={`w-4 h-4 text-vc-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span className="font-display font-medium text-sm text-vc-text">
            Custom Brand Voice Profile
          </span>
          {isActive && (
            <span className="text-[10px] bg-vc-pass/10 text-vc-pass px-2 py-0.5 rounded-full font-mono font-medium uppercase tracking-wider">
              Active
            </span>
          )}
        </div>
        
        {/* Toggle Switch */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleActive();
          }}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isActive ? "bg-vc-pass" : "bg-neutral-800"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isActive ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Expandable Body */}
      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-vc-border/50 flex flex-col gap-4 text-left">
          {/* Rules/Tone guidelines */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-vc-text-muted uppercase tracking-wider">
              Tone Guidelines & Rules
            </label>
            <textarea
              value={rules}
              onChange={handleRulesChange}
              placeholder="e.g. Keep a premium editor tone, use clean Indian Hinglish syntax, avoid calling customers 'fam', mention product quality over discounts."
              className="w-full min-h-[70px] bg-vc-bg border border-vc-border rounded px-3 py-2 text-sm text-vc-text placeholder-vc-text-secondary focus:outline-none focus:border-vc-neutral font-sans resize-none"
            />
          </div>

          {/* Reference Posts */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-vc-text-muted uppercase tracking-wider">
              Reference Brand Posts (Top 3)
            </label>
            <div className="flex flex-col gap-2">
              {posts.map((post, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-xs font-mono text-vc-text-secondary w-4 text-center">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={post}
                    onChange={(e) => handlePostChange(idx, e.target.value)}
                    placeholder={`e.g. Sample high-performing post ${idx + 1}...`}
                    className="flex-1 bg-vc-bg border border-vc-border rounded px-3 py-1.5 text-xs text-vc-text placeholder-vc-text-secondary focus:outline-none focus:border-vc-neutral"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-[10px] text-vc-text-secondary leading-normal">
            * Enabling your Brand Voice Profile will evaluate all future drafts against your guidelines instead of a generic Gen Z baseline.
          </p>
        </div>
      )}
    </div>
  );
}
