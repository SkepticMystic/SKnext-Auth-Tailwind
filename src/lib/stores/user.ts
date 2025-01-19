import type { User } from "lucia";
import { writable } from "svelte/store";

const store = writable<User | undefined>(undefined);

export const user = {
  ...store,
};
