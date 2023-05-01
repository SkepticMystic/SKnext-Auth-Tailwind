import { error } from "@sveltejs/kit";
import { z } from "zod";

const raw = <O, D extends z.ZodTypeDef, I>(
  input: any,
  schema: z.ZodSchema<O, D, I>,
) => {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const { code, message, path } = issue;

    switch (code) {
      case z.ZodIssueCode.invalid_enum_value: {
        const { options } = issue;
        throw error(400, `${message} (options: ${options.join(", ")})`);
      }
      default:
        throw error(400, `${message} at ${path.join(".")}`);
    }
  } else return parsed.data;
};

/** Try parsing a request using a Zod schema
 * Throws a SK error if invalid
 */
const request = async <O, D extends z.ZodTypeDef, I>(
  request: Request,
  schema: z.ZodSchema<O, D, I>,
) => {
  const input = await request.json();
  return raw(input, schema);
};
const form = async <O, D extends z.ZodTypeDef, I>(
  request: Request,
  schema: z.ZodSchema<O, D, I>,
) => {
  const form = await request.formData();
  const input = Object.fromEntries(form);
  return raw(input, schema);
};
const params = <O, D extends z.ZodTypeDef, I>(
  params: URLSearchParams | URL,
  schema: z.ZodSchema<O, D, I>,
) => {
  const input = Object.fromEntries(
    params instanceof URLSearchParams ? params : params.searchParams,
  );
  return raw(input, schema);
};

export const Parsers = {
  raw,
  request,
  form,
  params,
};
