export interface Redirect {
    status: 302 | 303 | 307 | 308
    location: string
}

export type Primitive = string | number | boolean | null | undefined;

export type OK = { ok: boolean }
export type D<T> = { data: T }
export type DOK = D<OK>