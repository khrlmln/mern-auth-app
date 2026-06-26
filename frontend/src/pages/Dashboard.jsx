import {
  CheckCircle2,
  ChevronRight,
  KeyRound,
  LogOut,
  Moon,
  ShieldCheck,
  Sun,
  User2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { formatDate } from "../lib/utils";

function Avatar({ name = "" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm shrink-0 select-none">
      {initials || <User2 className="w-4 h-4" />}
    </div>
  );
}

function ThemeToggleInline() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent transition-colors"
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-muted-foreground" />
          Light mode
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-muted-foreground" />
          Dark mode
        </>
      )}
    </button>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">AuthKit</span>
          </div>

          <div className="flex items-center gap-2">
            <Avatar name={user.fullName} />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Hello, {user.fullName.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here&apos;s an overview of your account.
          </p>
        </div>
        {/* Profile card */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0 select-none">
              {user.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">
                {user.fullName}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Details grid */}
          <div className="divide-y divide-border">
            <ProfileRow label="Email status">
              {user.isEmailVerified ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm text-destructive">
                  <XCircle className="w-3.5 h-3.5" />
                  Not verified
                </span>
              )}
            </ProfileRow>

            <ProfileRow label="Member since">
              <span className="text-sm text-muted-foreground">
                {formatDate(user.createdAt)}
              </span>
            </ProfileRow>

            <ProfileRow label="Last updated">
              <span className="text-sm text-muted-foreground">
                {formatDate(user.updatedAt)}
              </span>
            </ProfileRow>
          </div>
        </div>
        {/* Actions */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <p className="text-sm font-semibold text-foreground">
              Account actions
            </p>
          </div>
          <div className="divide-y divide-border">
            <ActionRow
              icon={<KeyRound className="w-4 h-4" />}
              label="Change password"
              description="Update your account password"
              to="/change-password"
            />

            <div className="px-4 py-1">
              <ThemeToggleInline />
            </div>

            <div className="px-4 py-2">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
              >
                {loggingOut ? (
                  <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                {loggingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProfileRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-3.5">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <div className="flex items-center">{children}</div>
    </div>
  );
}

function ActionRow({ icon, label, description, to }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-4 py-1">
      <div className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent transition-colors group">
        <span className="text-muted-foreground group-hover:text-foreground transition-colors">
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium leading-snug">{label}</p>
          <p className="text-xs text-muted-foreground leading-snug">
            {description}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  );
}
