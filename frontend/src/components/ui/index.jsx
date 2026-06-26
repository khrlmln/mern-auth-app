import { cn } from "../../lib/utils";

// Label
export function Label({ className, ...props }) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none text-foreground",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

// Alert
const alertVariants = {
  default: "bg-muted text-foreground border-border",
  destructive:
    "border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/40 dark:bg-destructive/15",
  success:
    "border-green-500/30 bg-green-500/10 text-green-700 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-400",
  warning:
    "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:border-yellow-500/40 dark:bg-yellow-500/15 dark:text-yellow-400",
  info: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/15 dark:text-blue-400",
};

export function Alert({ className, variant = "default", children, ...props }) {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-3.5 text-sm",
        alertVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertTitle({ className, ...props }) {
  return (
    <h5
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export function AlertDescription({ className, ...props }) {
  return (
    <div
      className={cn("text-sm leading-relaxed [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

// Badge
const badgeVariants = {
  default: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary text-secondary-foreground border-border",
  success:
    "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  warning:
    "bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-400",
  outline: "text-foreground border-border",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

// Card
export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
  );
}

// Separator
export function Separator({ className, orientation = "horizontal", ...props }) {
  return (
    <div
      role="separator"
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}
