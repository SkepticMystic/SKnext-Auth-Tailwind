import type { SID } from "$lib/interfaces";
import { App } from "$lib/utils/app";
import type { User } from "lucia";
import { APP } from "./app";

const COMMON = {
  SIGNATURE: {
    TEXT: `
Kind regards,
${APP.NAME}
${APP.URL}
`.trim(),

    HTML: `
<p>
    Regards, <br />
    ${APP.NAME}
</p>`.trim(),
  },
};

// TODO: Implement in OTP.handleLinks
export const EMAIL_TEMPLATES = {
  "password-reset": (data: {
    token: string;
    user: SID<Lucia.DatabaseUserAttributes>;
  }) => ({
    subject: `Reset your ${APP.NAME} password`,
    text: `
Hi,

Click here to reset your ${APP.NAME} password: ${App.full_url("/reset-password", { token: data.token })}.

If you did not request this, you can safely ignore this email.

${COMMON.SIGNATURE.TEXT}`.trim(),
    // attachment: {
    //   data: ``,
    //   alternative: true,
    // },
  }),

  "email-verification": (data: { token: string; user: User }) => ({
    subject: `Verify your ${APP.NAME} account`,
    text: `
Hi,

Click here to verify your ${APP.NAME} account: ${App.full_url("/api/verify-email", { token: data.token })}.

If you did not request this, you can safely ignore this email.

${COMMON.SIGNATURE.TEXT}`.trim(),
    // attachment: {
    //   data: ``,
    //   alternative: true,
    // },
  }),

  "new-signup": (data: { user: Pick<User, "email" | "userId"> }) => ({
    subject: `New ${APP.NAME} signup: ${data.user.email}`,
    text: `
Hiya,

A new user has signed up to ${APP.NAME}: 

${data.user.email}

Click here to view their account: ${App.full_url("/admin/users/view", { user_id: data.user.userId })}

${COMMON.SIGNATURE.TEXT}`.trim(),
    // attachment: {
    //   data: ``,
    //   alternative: true,
    // },
  }),
} satisfies Record<
  string,
  (...args: any) => {
    subject: string;
    text: string;
    // attachment: { data: string; alternative: true };
  }
>;
