import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

export function AuthLayout({ children, title, description }) {
  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-[44%] bg-[oklch(0.07_0_0)] text-white flex-col justify-between p-12 relative overflow-hidden select-none">
        {/* Dot-grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Logo */}
        <Link
          to="/"
          className="relative z-10 flex items-center gap-2.5 group w-fit"
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow">
            <ShieldCheck className="w-4 h-4 text-black" />
          </div>
          <span className="font-semibold text-lg tracking-tight">AuthKit</span>
        </Link>

        {/* Headline */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight">
              Secure, modern
              <br />
              authentication.
            </h1>
            <p className="text-white/50 text-base leading-relaxed max-w-xs">
              A production-ready MERN authentication system with everything you
              need out of the box.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-xs text-white/25">
          © {new Date().getFullYear()} AuthKit · Built with ♥️ using Express
          &amp; React
        </p>
      </div>

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar with mobile logo & theme toggle */}
        <div className="flex items-center justify-between px-6 py-4 lg:justify-end">
          <Link
            to="/"
            className="lg:hidden flex items-center gap-2 text-foreground"
          >
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">AuthKit</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm">
            {/* Page heading */}
            {(title || description) && (
              <div className="mb-7">
                {title && (
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-muted-foreground text-sm mt-1.5">
                    {description}
                  </p>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
