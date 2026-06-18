import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/features/auth/authApi";
import { setCredentials } from "@/features/auth/authSlice";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [login, { error, isLoading }] = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const session = await login(values).unwrap();
      dispatch(setCredentials(session));

      const redirectTo =
        (location.state as { from?: { pathname?: string } } | null)?.from
          ?.pathname ?? "/app";

      navigate(redirectTo, { replace: true });
    } catch {
      return;
    }
  });

  return (
    <main className="grid min-h-svh place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <div className="grid size-10 place-items-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
            CP
          </div>
          <h1 className="text-2xl font-semibold tracking-normal">CallPilot AI</h1>
          <p className="text-sm text-muted-foreground">Sign in to continue.</p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(form.formState.errors.email)}
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(form.formState.errors.password)}
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          {error ? (
            <div
              role="alert"
              className="flex gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>Unable to sign in with those credentials.</span>
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in" : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
