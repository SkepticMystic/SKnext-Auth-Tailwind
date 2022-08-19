import type { AxiosError } from "./interfaces";

export const getFirstError = (error: AxiosError) => Object.values(error.response.data.errors)[0] as string;