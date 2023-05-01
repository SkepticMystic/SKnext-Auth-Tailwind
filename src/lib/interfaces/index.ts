export type Primitive = string | number | boolean | null | undefined;

export type Err<E extends unknown = undefined> = { ok: false; error: E };
export type Suc<D extends unknown = undefined> = { ok: true; data: D };
export type Result<
  D extends unknown = undefined,
  E extends unknown = undefined,
> = Suc<D> | Err<E>;
