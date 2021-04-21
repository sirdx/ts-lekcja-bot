import { GuardFunction } from "@typeit/discord";

import * as BotConfig from "../../bot-config.json";

export const BotAdmin: GuardFunction<"message"> = async (
  [message],
  client,
  next
) => {
  if (BotConfig.settings.admins.includes(message.author.id)) {
    await next();
  }
}