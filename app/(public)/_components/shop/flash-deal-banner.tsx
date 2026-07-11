"use client";

import { useEffect, useState } from "react";
import { Zap, Clock, ArrowRight } from "lucide-react";
import { useFlashDeals } from "@/lib/hooks/public/useFlashDeals";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(endsAt: string): TimeLeft {
  const diff = Math.max(0, new Date(endsAt).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function Pad({ n }: { n: number }) {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/15 text-lg font-bold tabular-nums text-white backdrop-blur-sm">
      {n.toString().padStart(2, "0")}
    </span>
  );
}

function Separator() {
  return <span className="text-xl font-bold text-yellow-300">:</span>;
}

export function FlashDealBanner() {
  const { data } = useFlashDeals("active");
  const deals: any[] = data?.data ?? [];
  const deal = deals[0];

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    if (!deal?.ends_at) return;
    setTimeLeft(getTimeLeft(deal.ends_at));

    const id = setInterval(() => {
      const t = getTimeLeft(deal.ends_at);
      setTimeLeft(t);
      if (t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
        clearInterval(id);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [deal?.ends_at]);

  if (!deal) return null;

  const discountLabel =
    deal.discount_type === "percentage"
      ? `${parseFloat(deal.discount_value)}% OFF`
      : `৳${parseFloat(deal.discount_value)} OFF`;

  return (
    <div className="mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 p-px shadow-lg">
      <div className="flex flex-col items-start gap-4 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: label + title */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
            <Zap className="h-6 w-6 fill-yellow-300 text-yellow-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-yellow-300 px-2 py-0.5 text-xs font-extrabold uppercase tracking-widest text-red-700">
                Flash Deal
              </span>
              <span className="rounded bg-white/20 px-2 py-0.5 text-xs font-bold text-white">
                {discountLabel}
              </span>
            </div>
            <p className="mt-1 text-base font-bold text-white sm:text-lg">
              {deal.title}
            </p>
            {deal.description && (
              <p className="text-xs text-white/80">{deal.description}</p>
            )}
          </div>
        </div>

        {/* Center: countdown */}
        {timeLeft && (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-white/70" />
              <span className="text-xs font-medium uppercase tracking-wider text-white/70">
                Ends in
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Pad n={timeLeft.hours} />
              <Separator />
              <Pad n={timeLeft.minutes} />
              <Separator />
              <Pad n={timeLeft.seconds} />
            </div>
            <div className="flex w-full justify-between px-1 text-[10px] text-white/60">
              <span className="w-10 text-center">HRS</span>
              <span className="w-1" />
              <span className="w-10 text-center">MIN</span>
              <span className="w-1" />
              <span className="w-10 text-center">SEC</span>
            </div>
          </div>
        )}

        {/* Right: stock + cta */}
        <div className="flex flex-col items-end gap-2">
          {deal.remaining_quantity != null && (
            <div className="text-right">
              <p className="text-xs text-white/70">Items remaining</p>
              <div className="mt-1 h-2 w-32 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-yellow-300 transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      deal.quantity_limit
                        ? ((deal.quantity_limit - deal.remaining_quantity) /
                            deal.quantity_limit) *
                            100
                        : 0
                    )}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-xs font-semibold text-white">
                {deal.remaining_quantity} left
              </p>
            </div>
          )}
          <a
            href="#flash-deal-products"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-bold text-red-600 shadow-sm transition-colors hover:bg-yellow-50"
          >
            Shop Now <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
