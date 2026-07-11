import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-20">
      <div className="w-full max-w-lg text-center">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">
          Error 404
        </p>

        <h1 className="mt-4 text-7xl sm:text-8xl font-extrabold text-secondary select-none">
          404
        </h1>

        <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-foreground">
          Page not found
        </h2>

        <p className="mt-3 text-base text-foreground/60">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          may have been moved, renamed, or no longer exists.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:opacity-90 w-full sm:w-auto"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted w-full sm:w-auto"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
