import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert, Label, Separator } from "../components/ui/index";
import { getErrorMessage } from "../lib/utils";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(form);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Check your inbox"
        description="One last step to get started"
      >
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
                Account created!
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                We&apos;ve sent a verification email to{" "}
                <span className="font-medium text-foreground">
                  {form.email}
                </span>
                . Click the link in that email to activate your account.
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Didn&apos;t receive it?{" "}
            <Link
              to={`/resend-verification?email=${encodeURIComponent(form.email)}`}
              className="font-medium text-foreground hover:underline underline-offset-2"
            >
              Resend verification email
            </Link>
          </p>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/login")}
          >
            Back to sign in
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create an account"
      description="Get started in less than a minute"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert variant="destructive">{error}</Alert>}

        {/* Full name */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            value={form.fullName}
            onChange={handleChange}
            minLength={3}
            maxLength={30}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              className="pr-10"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters
          </p>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Create account
        </Button>

        <Separator />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
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
