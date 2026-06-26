import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { changePassword } from "../api/auth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert, Label } from "../components/ui/index";
import { useAuth } from "../contexts/AuthContext";
import { getErrorMessage } from "../lib/utils";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (form.newPassword === form.currentPassword) {
      setError("New password must be different from your current password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopBar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm space-y-5">
            <div className="rounded-xl border border-border bg-card p-6 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">
                  Password changed
                </h2>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Your password has been updated. For security, you&apos;ve been
                  signed out of all sessions. Please sign in again with your new
                  password.
                </p>
              </div>
              <Button
                className="w-full"
                onClick={async () => {
                  await logout();
                  navigate("/login", { replace: true });
                }}
              >
                Sign in again
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />

      <main className="flex-1 flex items-start justify-center p-6 pt-8">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to dashboard
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Change password
            </h1>
            <p className="text-muted-foreground text-sm mt-1.5">
              Update your account password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <Alert variant="destructive">{error}</Alert>}

            {/* Current password */}
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Your current password"
                  value={form.currentPassword}
                  onChange={handleChange}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrent ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* New password */}
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNew ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  value={form.newPassword}
                  onChange={handleChange}
                  minLength={8}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNew ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm new password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showNew ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat your new password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* Strength hints */}
            {form.newPassword && (
              <ul className="text-xs space-y-1">
                <li
                  className={
                    form.newPassword.length >= 8
                      ? "text-green-600 dark:text-green-400"
                      : "text-muted-foreground"
                  }
                >
                  {form.newPassword.length >= 8 ? "✓" : "○"} At least 8
                  characters
                </li>
                {form.confirmPassword && (
                  <li
                    className={
                      form.newPassword === form.confirmPassword
                        ? "text-green-600 dark:text-green-400"
                        : "text-destructive"
                    }
                  >
                    {form.newPassword === form.confirmPassword ? "✓" : "✗"}{" "}
                    Passwords match
                  </li>
                )}
                {form.currentPassword &&
                  form.newPassword === form.currentPassword && (
                    <li className="text-destructive">
                      ✗ Must differ from current password
                    </li>
                  )}
              </ul>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Update password
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Changing your password will sign you out of all active sessions.
          </p>
        </div>
      </main>
    </div>
  );
}

function TopBar() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">AuthKit</span>
        </Link>
      </div>
    </header>
  );
}
