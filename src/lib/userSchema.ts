import * as z from 'zod'

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .email(),
    name: z
      .string()
      .min(3),
    password: z
      .string()
      .min(6, { message: "Password is too short" })
      .max(64, { message: "Password is too long" }),
  });

  export const LoginSchema = z
  .object({
    email: z
      .string()
      .email(),
    password: z
      .string()
      .min(6, { message: "Password is too short" })
      .max(64, { message: "Password is too long" }),
  });