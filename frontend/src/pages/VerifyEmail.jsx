import { CheckCircle2, Loader2, MailWarning, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../api/auth";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Button } from "../components/ui/Button";
import { getErrorMessage } from "../lib/utils";

const STATUS = {
  IDLE: "idle", // no token in URL
  LOADING: "loading", // calling API
  SUCCESS: "success",
  ERROR: "error",
};

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState(token ? STATUS.LOADING : STATUS.IDLE);
  const [message, setMessage] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    if (!token || calledRef.current) return;
    calledRef.current = true;

    const verify = async () => {
      try {
        const { data } = await verifyEmail(token);
        setMessage(data.message || "Email verified successfully.");
        setStatus(STATUS.SUCCESS);
      } catch (err) {
        setMessage(getErrorMessage(err));
        setStatus(STATUS.ERROR);
      }
    };

    verify();
  }, [token]);

  if (status === STATUS.IDLE) {
    return (
      <AuthLayout title="Verify your email" description="You're almost there">
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <MailWarning className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">
                Check your inbox
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                We sent a verification link to your email address. Click that
                link to activate your account. The link expires in 24 hours.
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Didn&apos;t receive it?{" "}
            <Link
              to="/resend-verification"
              className="font-medium text-foreground hover:underline underline-offset-2"
            >
              Resend verification email
            </Link>
          </p>

          <Button variant="outline" className="w-full" asChild>
            <Link to="/login">Back to sign in</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (status === STATUS.LOADING) {
    return (
      <AuthLayout title="Verifying…" description="Please hold on">
        <div className="flex flex-col items-center gap-4 py-6">
          <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
          <p className="text-sm text-muted-foreground">
            Verifying your email address…
          </p>
        </div>
      </AuthLayout>
    );
  }

  if (status === STATUS.SUCCESS) {
    return (
      <AuthLayout title="Email verified" description="Your account is active">
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                You&apos;re all set!
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {message} You can now sign in to your account.
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
      title="Verification failed"
      description="The link may have expired"
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">
              Link invalid or expired
            </p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button className="w-full" asChild>
            <Link to="/resend-verification">Request a new link</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/login">Back to sign in</Link>
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
