export interface HTTPError<
  T = {
    message: string;
    status: number;
  },
> {
  response: {
    data: T;
  };
}

export type ActionError = HTTPError<{
  type: "error";
  error: { message: string };
}>;
