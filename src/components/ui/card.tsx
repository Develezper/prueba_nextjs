import type { ComponentPropsWithoutRef, ReactNode } from "react";

type DivProps = ComponentPropsWithoutRef<"div">;
type HeadingProps = ComponentPropsWithoutRef<"h3">;

function joinClassNames(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={joinClassNames(
        "rounded-3xl border border-slate-200 bg-white text-slate-950 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return (
    <div
      className={joinClassNames("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HeadingProps) {
  return (
    <h3
      className={joinClassNames(
        "text-xl font-semibold leading-none tracking-tight text-slate-900",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: DivProps) {
  return (
    <div className={joinClassNames("px-6 pb-6 pt-0", className)} {...props} />
  );
}

export type { ReactNode };
