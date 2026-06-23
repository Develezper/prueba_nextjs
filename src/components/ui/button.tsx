import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

function joinClassNames(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}

const variantClassNames: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:ring-emerald-600",
  secondary:
    "bg-white text-slate-950 ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:ring-emerald-600",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-emerald-600",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={joinClassNames(
        "inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
        variantClassNames[variant],
        className,
      )}
      {...props}
    />
  );
}
