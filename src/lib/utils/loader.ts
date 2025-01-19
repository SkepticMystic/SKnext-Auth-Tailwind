import { writable } from "svelte/store";

export const Loader = <S extends string>() => {
  const store = writable<Partial<Record<S, boolean>>>({});

  return {
    ...store,

    load: (s: S) =>
      store.update((value) => {
        value[s] = true;
        return value;
      }),
    reset: () => store.set({}),
  };
};

export const any_loading = ($loader: Partial<Record<string, boolean>>) =>
  Object.keys($loader).length > 0;
