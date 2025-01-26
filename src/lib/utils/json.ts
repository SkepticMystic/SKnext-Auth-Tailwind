export const Json = {
  str_or_stringify: (x: unknown) =>
    typeof x === "string" ? x : JSON.stringify(x, null, 2),
};
