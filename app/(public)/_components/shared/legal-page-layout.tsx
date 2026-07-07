import { ReactNode } from "react";

interface LegalPageLayoutProps {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  children: ReactNode;
}

export function LegalPageLayout({
  title,
  subtitle,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-black py-16 text-white md:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/80" />
        <div className="container relative z-10 mx-auto max-w-[1000px] px-4">
          <h1 className="text-3xl font-bold tracking-tight uppercase md:text-5xl">
            {title.split(" ").map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="text-[#ffb81e] italic font-serif">
                  {word}
                </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-base text-gray-300 md:text-lg">
              {subtitle}
            </p>
          )}
          {lastUpdated && (
            <p className="mt-6 text-sm text-gray-400">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-[900px] px-4">
          <div className="prose prose-base rounded-xl border border-border bg-white p-6 shadow-sm md:p-10">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}
