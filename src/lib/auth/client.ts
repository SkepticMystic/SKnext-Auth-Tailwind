import axios from "axios";

export const set_href = (href = "/") => {
  window.location.href = href;
};

export const signout = async () => {
  await axios.post("/api/auth/signout");
  set_href("/");
};
