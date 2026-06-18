export function FoundationPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-normal">Overview</h2>
        <p className="text-sm text-muted-foreground">CallPilot AI</p>
      </div>

      <section className="rounded-lg border border-dashed bg-card p-8">
        <div className="max-w-xl space-y-2">
          <h3 className="text-base font-semibold">Application foundation</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            The workspace shell is ready for product modules.
          </p>
        </div>
      </section>
    </div>
  );
}

