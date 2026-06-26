import { CheckCircle2, Eye, EyeOff, XCircle } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/auth";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert, Label, Separator } from "../components/ui/index";
import { getErrorMessage } from "../lib/utils";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ password: "", confirm: "" });
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

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await resetPassword(token, form.password);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout
        title="Invalid link"
        description="This reset link is missing a token"
      >
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This link is invalid. Please request a new password reset from the
              forgot password page.
            </p>
          </div>
          <Button className="w-full" asChild>
            <Link to="/forgot-password">Request new link</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout title="Password reset" description="You're all set">
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                Password updated
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Your password has been reset successfully. You can now sign in
                with your new password.
              </p>
            </div>
          </div>
          <Button className="w-full" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter a new password for your account"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert variant="destructive">{error}</Alert>}

        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
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
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm new password</Label>
          <Input
            id="confirm"
            name="confirm"
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your new password"
            value={form.confirm}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password strength hint */}
        {form.password && (
          <ul className="text-xs text-muted-foreground space-y-1">
            <li
              className={
                form.password.length >= 8
                  ? "text-green-600 dark:text-green-400"
                  : ""
              }
            >
              {form.password.length >= 8 ? "✓" : "○"} At least 8 characters
            </li>
            {form.confirm && (
              <li
                className={
                  form.password === form.confirm
                    ? "text-green-600 dark:text-green-400"
                    : "text-destructive"
                }
              >
                {form.password === form.confirm ? "✓" : "✗"} Passwords match
              </li>
            )}
          </ul>
        )}

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={!form.password || !form.confirm}
        >
          Set new password
        </Button>

        <Separator />

        <p className="text-center text-sm text-muted-foreground">
          <Link
            to="/login"
            className="font-medium text-foreground hover:underline underline-offset-2"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
