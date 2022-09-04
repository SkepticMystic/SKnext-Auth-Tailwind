import { error } from "@sveltejs/kit";
import type { AxiosError } from "../interfaces";


export const errToString = (err: unknown) => {
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message;
    return JSON.stringify(err);
}

export const UNAUTHORIZED = () => error(401, 'Unauthorized')
export const FORBIDDEN = () => error(403, 'Forbidden')
export const INTERNAL_SERVER_ERROR = (err: unknown) => error(500, errToString(err))

export const getFirstError = (error: AxiosError) => Object.values(error.response.data.errors)[0] as string;