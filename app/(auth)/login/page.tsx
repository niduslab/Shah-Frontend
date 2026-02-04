export default function LoginPage() {
  return (
    <div className="space-y-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Sign in</h1>
        <p className="text-sm text-foreground/70">
          Access your account to continue.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <button className="h-11 rounded-lg bg-primary text-primary-foreground font-medium">
          Continue
        </button>
        <button className="h-11 rounded-lg border border-border text-foreground font-medium">
          Create account
        </button>
      </div>
    </div>
  );
}

