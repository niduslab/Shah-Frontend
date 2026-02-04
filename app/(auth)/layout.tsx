export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="min-h-screen bg-surface text-foreground flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl bg-background p-8 shadow">
        {children}
      </div>
    </section>
  );
}

