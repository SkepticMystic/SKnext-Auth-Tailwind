import { APP } from "$lib/const/app";
import { Url } from "./urls";

const full_url = (path: string, search: Record<string, unknown>) =>
  Url.build(APP.URL, path, search);

export const App = {
  full_url,

  url: (path: string, search: Record<string, unknown>) =>
    Url.strip_origin(full_url(path, search)),
};
