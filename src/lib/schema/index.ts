import { error } from "@sveltejs/kit";
import { z } from "zod";

export const parseInputAs = <O, D extends z.ZodTypeDef, I>(input: any, schema: z.ZodSchema<O, D, I>) => {
    const parsed = schema.safeParse(input)
    if (!parsed.success) throw error(400, parsed.error.issues[0].message)
    return parsed.data
}

/** Try parsing a request using a Zod schema
 * Throws a SK error if invalid
 */
export const parseRequestAs = async <O, D extends z.ZodTypeDef, I>(request: Request, schema: z.ZodSchema<O, D, I>) => {
    const input = await request.json()
    return parseInputAs(input, schema)
}


export const emailSchema = z.string().email();
export const isValidEmail = (email: string) => emailSchema.safeParse(email).success

export const passwordSchema = z.string().min(4)