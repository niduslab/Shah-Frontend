"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api/axios";

export function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email");
      return;
    }
    setError("");

    setIsSubmitting(true);
    try {
      const response = await api.post("/api/newsletter/subscribe", {
        email: trimmed,
      });

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Thanks for subscribing! Your 20% off code is on its way."
        );
        setEmail("");
      }
    } catch (err: any) {
      if (err.response?.data?.errors?.email) {
        const msg = Array.isArray(err.response.data.errors.email)
          ? err.response.data.errors.email[0]
          : String(err.response.data.errors.email);
        setError(msg);
        toast.error(msg);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-[#351C06] py-16">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-8 md:flex-row px-4 md:px-6">
        <div className="w-full max-w-xl">
          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            Get <span className="text-[#FFC107] italic">20%</span> Off for Your First Order
          </h2>
        </div>

        <div className="w-full max-w-xl">
          <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter Your Email"
                aria-label="Email address"
                className={`w-full rounded-sm bg-white px-6 py-4 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                  error ? "ring-2 ring-red-500 focus:ring-red-500" : "focus:ring-[#FFC107]"
                }`}
              />
              {error && (
                <p className="mt-2 text-sm text-red-300">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-fit items-center justify-center gap-2 rounded-sm bg-[#FFC107] px-8 py-4 font-medium text-black transition-colors hover:bg-[#FFC107]/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  Subscribing <Loader2 className="h-5 w-5 animate-spin" />
                </>
              ) : (
                <>
                  Subscribe <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
          <p className="mt-3 text-sm text-white/90">
            By subscribing you agree to the Term of use & Privacy Policy
          </p>
        </div>
      </div>
    </section>
  );
}
