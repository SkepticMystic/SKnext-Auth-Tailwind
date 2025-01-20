import { dev } from "$app/environment";

export const APP = {
  NAME: "Generic App",
  URL: dev ? "http://127.0.0.1:5173" : "https://generic-app.co.za",
};
