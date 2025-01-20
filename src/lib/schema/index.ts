import { z } from "zod";

export const password_schema = z
  .string()
  .min(4, "Your password must be atleast 4 characters");
