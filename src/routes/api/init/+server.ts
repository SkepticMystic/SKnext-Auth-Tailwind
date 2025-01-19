import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals }) => {
  const session = await locals.auth.validate();
  const user = session?.user;

  return json({
    user,
  });
};
