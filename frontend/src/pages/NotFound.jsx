import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";

export default function NotFound() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-6">
      <Link to="/" className="flex items-center gap-2 mb-12">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-semibold">AuthKit</span>
      </Link>

      <div className="space-y-3 mb-8">
        <p className="text-7xl font-bold tracking-tight text-foreground">404</p>
        <h1 className="text-xl font-semibold text-foreground">
          Page not found
        </h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>
      </div>

      <Button asChild>
        <Link to={isAuthenticated ? "/dashboard" : "/login"}>
          {isAuthenticated ? "Go to dashboard" : "Back to sign in"}
        </Link>
      </Button>
    </div>
  );
}
