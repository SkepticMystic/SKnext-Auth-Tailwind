import type { Err, SID, Suc } from "$lib/interfaces";
import type { ObjectId } from "mongodb";

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
