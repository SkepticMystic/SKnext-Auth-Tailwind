import type { D } from ".";

export interface HTTPError<
  T = {
    message: string;
    status: number;
  }
> {
  response: D<T>;
}

export type ActionError = HTTPError<{
  type: "error";
  error: { message: string };
}>;
