import { z } from "zod";

export const emailSchema = z.string().email();
export const isValidEmail = (email: string) => emailSchema.safeParse(email).success

export const passwordSchema = z.string().min(4)