import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert, Label, Separator } from "../components/ui/index";
import { getErrorMessage } from "../lib/utils";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthLayout
        title="Check your inbox"
        description="A reset link is on its way"
      >
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                Reset link sent
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                If an account exists for{" "}
                <span className="font-medium text-foreground">{email}</span>,
                you'll receive a password reset link shortly. The link expires
                in <strong className="text-foreground">15 minutes</strong>.
              </p>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Didn&apos;t receive it? Check your spam folder or{" "}
            <button
              onClick={() => setSubmitted(false)}
              className="font-medium text-foreground hover:underline underline-offset-2"
            >
              try again
            </button>
            .
          </p>

          <Button variant="outline" className="w-full" asChild>
            <Link to="/login">Back to sign in</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password?"
      description="Enter your email and we'll send you a reset link"
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
          Send reset link
        </Button>

        <Separator />

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
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
