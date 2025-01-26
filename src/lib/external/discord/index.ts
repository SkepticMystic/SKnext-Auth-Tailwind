import { DISCORD_WEBHOOK_URL } from "$env/static/private";
import axios from "axios";

const msg = async (content: string) => {
  try {
    const { data } = await axios.post(DISCORD_WEBHOOK_URL, {
      content,
    });

    console.log("Discord.msg data", data);
  } catch (error) {
    console.log("Discord.msg error", error);
  }
};

export const Discord = {
  msg,
};
