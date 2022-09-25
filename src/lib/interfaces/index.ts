export interface HTTPError<D = {
    message: string
    status: number
}> {
    response: {
        data: D
    }
}

export type ActionError = HTTPError<{ type: 'error', error: { message: string } }>

export interface Redirect {
    status: 302 | 303 | 307 | 308
    location: string
}

export interface ZodError {
}

export type Primitive = string | number | boolean | null | undefined;