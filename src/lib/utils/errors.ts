import type { ActionError, HTTPError } from "$lib/interfaces/errors";
import { error } from "@sveltejs/kit";
import { Json } from "./json";

const errToString = (err: unknown) => {
  if (err instanceof Error) {
    return err.message;
  } else {
    return Json.str_or_stringify(err);
  }
};

export const INTERNAL_SERVER_ERROR = (err: unknown) =>
  error(500, errToString(err));

export const getHTTPErrorMsg = (err: unknown) =>
  (<HTTPError>err)?.response?.data?.message ?? errToString(err);
export const getActionErrorMsg = (err: unknown) =>
  (<ActionError>err)?.response?.data?.error?.message ?? errToString(err);
