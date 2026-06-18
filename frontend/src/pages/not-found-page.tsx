import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <main className="grid min-h-svh place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-normal">Page not found</h1>
        <Button asChild>
          <Link to="/app">Back to overview</Link>
        </Button>
      </div>
    </main>
  );
}

