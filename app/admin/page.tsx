export default function AdminPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl bg-background p-6 shadow">
        <h2 className="text-lg font-semibold text-foreground">Overview</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Manage products, orders, and customers.
        </p>
      </div>
      <div className="rounded-xl bg-background p-6 shadow">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="h-10 rounded-lg bg-primary px-4 text-primary-foreground font-medium">
            Add product
          </button>
          <button className="h-10 rounded-lg border border-border px-4 text-foreground font-medium">
            View orders
          </button>
        </div>
      </div>
    </div>
  );
}

