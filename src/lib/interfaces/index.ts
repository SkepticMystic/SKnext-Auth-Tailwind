export interface Redirect {
  status: 302 | 303 | 307 | 308;
  location: string;
}

export type Primitive = string | number | boolean | null | undefined;

export type OK = { ok: boolean };
export type D<T> = { data: T };
export type DOK = D<OK>;

export type Err<E extends unknown = undefined> = { ok: false; error?: E };
export type Suc<D extends unknown = undefined> = { ok: true; data?: D };
export type Result<
  D extends unknown = undefined,
  E extends unknown = undefined
> = Suc<D> | Err<E>;
