"use client";

import type { HTMLAttributes, ReactNode } from "react";
import {
  FormProvider,
  type FieldValues,
  type FormProviderProps,
} from "react-hook-form";
import { Label } from "@/src/components/ui/label";

interface FormLabelProps {
  htmlFor: string;
  children: ReactNode;
}

interface FormMessageProps {
  message?: string;
}

function joinClassNames(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}

export function Form<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>(props: FormProviderProps<TFieldValues, TContext, TTransformedValues>) {
  return <FormProvider {...props} />;
}

export function FormItem({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={joinClassNames("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

export function FormLabel({ htmlFor, children }: FormLabelProps) {
  return <Label htmlFor={htmlFor}>{children}</Label>;
}

export function FormControl({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={joinClassNames("space-y-2", className)} {...props} />;
}

export function FormMessage({ message }: FormMessageProps) {
  if (!message) {
    return null;
  }

  return <p className="text-sm font-medium text-red-600">{message}</p>;
}
