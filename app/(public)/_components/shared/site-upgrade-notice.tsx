"use client";

import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";

const DISMISS_KEY = "site-upgrade-notice-dismissed";

export function SiteUpgradeNotice() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) === "true") {
      setIsDismissed(true);
      return;
    }
    const timer = setTimeout(() => setIsMounted(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setIsDismissed(true);
  };

  if (!isMounted || isDismissed) return null;

  return (
    <div className="slide-up-fade" role="status" aria-live="polite">
      {/* Gradient accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

      <div className="relative overflow-hidden bg-gray-900 text-white shadow-[0_-8px_30px_rgba(0,0,0,0.25)]">
        {/* Subtle animated shimmer sweep */}
        <div className="pointer-events-none absolute inset-0 upgrade-shimmer" />

        <div className="container relative mx-auto px-4 py-3.5 sm:py-3">
          <div className="flex items-center justify-center gap-3 text-center">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-400/10 ring-1 ring-amber-400/30">
              <Sparkles className="h-4 w-4 text-amber-400 upgrade-icon-pulse" />
            </span>
            <p className="text-sm leading-snug text-gray-100">
              <span className="font-semibold text-white">We're upgrading our website.</span>{" "}
              <span className="text-gray-300">
                Some features may be temporarily limited while we roll out improvements.
                The full experience will be live soon, thank you for your patience.
              </span>
            </p>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss notice"
              className="ml-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
