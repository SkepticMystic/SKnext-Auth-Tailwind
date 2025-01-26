import { Json } from "./json";

export const Markdown = {
  codeblock: (code: unknown) =>
    `\n\`\`\`\n${Json.str_or_stringify(code)}\n\`\`\`\n`,
};
