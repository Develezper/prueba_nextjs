"use client";

import axios from "axios";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/src/components/ui/button";
import { getApiErrorMessage } from "@/src/lib/api-error";

export function LogoutButton() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = isSubmitting || isPending;

  async function handleLogout(): Promise<void> {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await axios.post("/api/auth/logout", null, {
        withCredentials: true,
      });

      startTransition(() => {
        router.push("/login");
        router.refresh();
      });
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(error, "No pudimos cerrar sesión. Intenta de nuevo."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="secondary"
        className="h-10 gap-2 px-4"
        disabled={isLoading}
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        {isLoading ? "Cerrando..." : "Cerrar sesión"}
      </Button>
      {errorMessage ? (
        <p className="max-w-48 text-right text-xs font-medium text-red-600">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
