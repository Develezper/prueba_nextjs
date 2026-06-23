import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[a-z]/, "La contraseña debe incluir una minúscula")
  .regex(/[A-Z]/, "La contraseña debe incluir una mayúscula")
  .regex(/[0-9]/, "La contraseña debe incluir un número")
  .regex(/[^A-Za-z0-9]/, "La contraseña debe incluir un símbolo");

export const loginSchema = z.object({
  email: z.string().trim().email("Ingresa un email válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(80, "El nombre no puede superar 80 caracteres"),
  email: z.string().trim().email("Ingresa un email válido"),
  password: passwordSchema,
});

export const registerFormSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
