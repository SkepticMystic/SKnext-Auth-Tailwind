export interface HTTPError {
    response: {
        data: {
            message: string
            status: number
        }
    }
}


export type Primitive = string | number | boolean | null | undefined;