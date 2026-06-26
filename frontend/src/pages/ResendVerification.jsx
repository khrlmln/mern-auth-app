import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resendVerificationEmail } from "../api/auth";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert, Label, Separator } from "../components/ui/index";
import { getErrorMessage } from "../lib/utils";

export default function ResendVerification() {
  const [searchParams] = useSearchParams();
  const prefilled = searchParams.get("email") || "";

  const [email, setEmail] = useState(prefilled);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await resendVerificationEmail(email);
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout title="Email sent" description="Check your inbox">
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                Verification email sent
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                We&apos;ve sent a new verification link to{" "}
                <span className="font-medium text-foreground">{email}</span>.
                The link expires in 24 hours.
              </p>
            </div>
          </div>

          <Button variant="outline" className="w-full" asChild>
            <Link to="/login">Back to sign in</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Resend verification"
      description="We'll send a new link to your inbox"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert variant="destructive">{error}</Alert>}

        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            required
          />
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Send verification email
        </Button>

        <Separator />

        <p className="text-center text-sm text-muted-foreground">
          Already verified?{" "}
          <Link
            to="/login"
            className="font-medium text-foreground hover:underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
