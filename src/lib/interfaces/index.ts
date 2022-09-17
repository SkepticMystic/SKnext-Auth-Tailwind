export interface HTTPError<D = {
    message: string
    status: number
}> {
    response: {
        data: D
    }
}

export type ActionError = HTTPError<{ type: 'error', error: { message: string } }>

export type Primitive = string | number | boolean | null | undefined;