export default function RegisterPage() {
  return (
    <div className="space-y-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Create account</h1>
        <p className="text-sm text-foreground/70">
          Sign up to start shopping.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <button className="h-11 rounded-lg bg-primary text-primary-foreground font-medium">
          Continue
        </button>
        <button className="h-11 rounded-lg border border-border text-foreground font-medium">
          Back to sign in
        </button>
      </div>
    </div>
  );
}

