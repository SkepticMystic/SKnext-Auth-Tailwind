import { TIME } from "$lib/const/time";

const show_date = (
  date: Date | string | number | undefined | null,
  options?: { strip_year?: boolean },
) => {
  const str = date
    ? new Date(date).toLocaleDateString("en-za", { dateStyle: "medium" })
    : "";

  return options?.strip_year ? str.replace(/ \d{4}$/, "") : str;
};

const show_time = (date: Date | string | number | undefined | null) =>
  date ? new Date(date).toTimeString().slice(0, 5) : "-";

const show_datetime = (
  date: Date | string | number | undefined | null,
  options?: { strip_year?: boolean },
) => {
  const str = date
    ? new Date(date).toLocaleString("en-ZA", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

  return options?.strip_year ? str.replace(/ \d{4},/, "") : str;
};

const plus_ms = (ms: number, dt = new Date()) => new Date(dt.getTime() + ms);
const plus_days = (days: number, dt = new Date()) =>
  plus_ms(days * TIME.DAY, dt);

const to_start_of_day = (dt: Date) => {
  const start = new Date(dt);
  start.setHours(0, 0, 0, 0);
  return start;
};
const to_end_of_day = (dt: Date) => {
  const end = new Date(dt);
  end.setHours(23, 59, 59, 999);
  return end;
};

export const Dates = {
  plus_ms,
  plus_days,

  to_start_of_day,
  to_end_of_day,

  show_date,
  show_time,
  show_datetime,
};
