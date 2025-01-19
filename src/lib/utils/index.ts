import type { Err, SID, Suc } from "$lib/interfaces";
import type { ObjectId } from "mongodb";

// TODO: Do away with this, it's mostly just for loadObj these days, and now we have Loader
export const getProps = <LoadKey extends string | number = string | number>(): {
  err: string;
  suc: string;
  loading: boolean;
  loadObj: Partial<Record<LoadKey, boolean>>;
  disabled: boolean;
} => ({
  err: "",
  suc: "",
  loading: false,
  loadObj: {},
  disabled: false,
});

export const _id_to_string = <T extends { _id: string | ObjectId | unknown }>(
  doc: T,
) => {
  if (doc?._id) doc._id = doc._id.toString();
  return doc as SID<T>;
};

export const err = <E = undefined>(e?: E): Err<E> => {
  const res = { ok: false } as Err<E>;
  if (e) res["error"] = e;
  return res;
};
export const suc = <D = undefined>(d?: D): Suc<D> => {
  const res = { ok: true } as Suc<D>;
  if (d) res["data"] = d;
  return res;
};
