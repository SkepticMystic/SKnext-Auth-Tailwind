import type { ActionError, HTTPError } from "$lib/interfaces/errors";
import { error } from "@sveltejs/kit";

export const errToString = (err: unknown) => {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  return JSON.stringify(err);
};

export const UNAUTHORIZED = () => error(401, "Unauthorized");
export const FORBIDDEN = () => error(403, "Forbidden");
export const NOT_FOUND = () => error(404, "Not found");
export const INTERNAL_SERVER_ERROR = (err: unknown) =>
  error(500, errToString(err));

export const getHTTPErrorMsg = (err: unknown) =>
  (<HTTPError>err)?.response?.data?.message ?? errToString(err);
export const getActionErrorMsg = (err: unknown) =>
  (<ActionError>err)?.response?.data?.error?.message ?? errToString(err);
