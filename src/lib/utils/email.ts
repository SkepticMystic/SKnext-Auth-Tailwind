import {
  SMTP_PASSWORD,
  SMTP_USERNAME,
  SMTP_HOST,
  EMAIL_SOURCE,
} from "$env/static/private";
import { Message, SMTPClient, type MessageHeaders } from "emailjs";

const client = new SMTPClient({
  ssl: true,
  host: SMTP_HOST,
  user: SMTP_USERNAME,
  password: SMTP_PASSWORD,
});

export const Email = {
  send: ({ subject, text, to, attachment, from }: Partial<MessageHeaders>) => {
    const msg = new Message({
      to,
      text,
      subject,
      attachment,
      from: from ?? EMAIL_SOURCE,
    });

    const { isValid, validationError } = msg.checkValidity();
    console.assert(isValid, validationError);

    return client.sendAsync(msg);
  },
};
