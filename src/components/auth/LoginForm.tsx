"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { getApiErrorMessage } from "@/src/lib/api-error";
import {
  loginSchema,
  type LoginFormValues,
} from "@/src/validations/auth.schema";

interface LoginApiResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

function getSafeRedirectPath(redirect: string | null): string {
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return "/";
  }

  return redirect;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting || isPending;

  async function onSubmit(values: LoginFormValues): Promise<void> {
    setFormError(null);

    try {
      await axios.post<LoginApiResponse>("/api/auth/login", values, {
        withCredentials: true,
      });

      const redirectPath = getSafeRedirectPath(searchParams.get("redirect"));

      startTransition(() => {
        router.push(redirectPath);
        router.refresh();
      });
    } catch (error: unknown) {
      setFormError(
        getApiErrorMessage(error, "No pudimos iniciar sesión. Intenta de nuevo."),
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormItem>
          <FormLabel htmlFor="email">Email</FormLabel>
          <FormControl>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              hasError={Boolean(form.formState.errors.email)}
              disabled={isSubmitting}
              {...form.register("email")}
            />
            <FormMessage message={form.formState.errors.email?.message} />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="password">Contraseña</FormLabel>
          <FormControl>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Tu contraseña"
              hasError={Boolean(form.formState.errors.password)}
              disabled={isSubmitting}
              {...form.register("password")}
            />
            <FormMessage message={form.formState.errors.password?.message} />
          </FormControl>
        </FormItem>

        {formError ? (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {formError}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>
    </Form>
  );
}
