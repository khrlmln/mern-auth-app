import { Children, cloneElement } from "react";
import { cn } from "../../lib/utils";

const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
  outline:
    "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs",
  link: "text-primary underline-offset-4 hover:underline p-0 h-auto font-normal",
};

const sizes = {
  sm: "h-9 px-3 text-xs rounded-md",
  default: "h-10 px-4 py-2 text-sm rounded-md",
  lg: "h-11 px-8 text-sm rounded-md",
  icon: "h-10 w-10 rounded-md",
};

const spinnerEl = (
  <svg
    className="w-4 h-4 animate-spin shrink-0"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

export function Button({
  children,
  variant = "default",
  size = "default",
  loading = false,
  className,
  disabled,
  type = "button",
  asChild = false,
  ...props
}) {
  const baseClass = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (asChild) {
    const child = Children.only(children);
    return cloneElement(child, {
      className: cn(baseClass, child.props.className),
      ...props,
    });
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={baseClass}
      {...props}
    >
      {loading && spinnerEl}
      {children}
    </button>
  );
}
