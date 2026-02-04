export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-surface text-foreground">
      <div className="border-b border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
          <span className="text-sm font-semibold">Admin Panel</span>
          <span className="text-xs font-medium">Authenticated User</span>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}

