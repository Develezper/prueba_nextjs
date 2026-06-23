"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { register } from "@/src/services/auth-client.service";
import {
  registerFormSchema,
  type RegisterFormValues,
} from "@/src/validations/auth.schema";

export function RegisterForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting || isPending;

  async function onSubmit(values: RegisterFormValues): Promise<void> {
    setFormError(null);

    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      startTransition(() => {
        router.push("/login");
      });
    } catch (error: unknown) {
      setFormError(
        getApiErrorMessage(error, "No pudimos crear tu cuenta. Intenta de nuevo."),
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormItem>
          <FormLabel htmlFor="name">Nombre</FormLabel>
          <FormControl>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Tu nombre"
              hasError={Boolean(form.formState.errors.name)}
              disabled={isSubmitting}
              {...form.register("name")}
            />
            <FormMessage message={form.formState.errors.name?.message} />
          </FormControl>
        </FormItem>

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
              autoComplete="new-password"
              placeholder="Crea una contraseña segura"
              hasError={Boolean(form.formState.errors.password)}
              disabled={isSubmitting}
              {...form.register("password")}
            />
            <FormMessage message={form.formState.errors.password?.message} />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="confirmPassword">Confirmar contraseña</FormLabel>
          <FormControl>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repite tu contraseña"
              hasError={Boolean(form.formState.errors.confirmPassword)}
              disabled={isSubmitting}
              {...form.register("confirmPassword")}
            />
            <FormMessage
              message={form.formState.errors.confirmPassword?.message}
            />
          </FormControl>
        </FormItem>

        {formError ? (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {formError}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>
    </Form>
  );
}
