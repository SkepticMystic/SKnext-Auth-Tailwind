import { error } from "@sveltejs/kit";
import { z } from "zod";

export const parseInputAs = <O, D extends z.ZodTypeDef, I>(input: any, schema: z.ZodSchema<O, D, I>) => {
    const parsed = schema.safeParse(input)
    if (!parsed.success) {
        const issue = parsed.error.issues[0];
        const { code, message, path } = issue

        switch (code) {
            case z.ZodIssueCode.invalid_enum_value: {
                const { options } = issue;
                throw error(400, `${message} (options: ${options.join(', ')})`);
            }
            default:
                throw error(400, `Invalid input: ${message} at ${path.join(".")}`)
        }

    }
    return parsed.data
}

/** Try parsing a request using a Zod schema
 * Throws a SK error if invalid
 */
export const parseRequestAs = async <O, D extends z.ZodTypeDef, I>(request: Request, schema: z.ZodSchema<O, D, I>) => {
    const input = await request.json()
    return parseInputAs(input, schema)
}
export const parseFormRequestAs = async <O, D extends z.ZodTypeDef, I>(request: Request, schema: z.ZodSchema<O, D, I>) => {
    const form = await request.formData()
    const input = Object.fromEntries(form.entries())
    return parseInputAs(input, schema)
}
export const parseParamsAs = <O, D extends z.ZodTypeDef, I>(params: URLSearchParams | URL, schema: z.ZodSchema<O, D, I>) => {
    const input = Object.fromEntries(params instanceof URLSearchParams ? params : params.searchParams)
    return parseInputAs(input, schema)
}


export const emailSchema = z.string().email();
export const isValidEmail = (email: string) => emailSchema.safeParse(email).success

export const passwordSchema = z.string().min(4)