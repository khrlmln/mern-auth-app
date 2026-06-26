import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert, Label, Separator } from "../components/ui/index";
import { useAuth } from "../contexts/AuthContext";
import { getErrorMessage } from "../lib/utils";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailUnverified, setEmailUnverified] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
    if (emailUnverified) setEmailUnverified(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setEmailUnverified(false);

    try {
      await login(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      if (err.response?.status === 403) {
        setEmailUnverified(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue to your account"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error alert */}
        {error && (
          <Alert variant="destructive">
            <p>{error}</p>
            {emailUnverified && (
              <div className="mt-2 flex gap-3 text-xs">
                <Link
                  to={`/resend-verification?email=${encodeURIComponent(form.email)}`}
                  className="font-semibold underline underline-offset-2 hover:no-underline"
                >
                  Resend verification email
                </Link>
              </div>
            )}
          </Alert>
        )}

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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
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

        {/* Submit */}
        <Button type="submit" className="w-full" loading={loading}>
          Sign in
        </Button>

        <Separator />

        {/* Sign-up link */}
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-foreground hover:underline underline-offset-2"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
