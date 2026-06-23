import type { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

function joinClassNames(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={joinClassNames(
        "text-sm font-semibold leading-none text-slate-800",
        className,
      )}
      {...props}
    />
  );
}
