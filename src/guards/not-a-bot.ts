import { GuardFunction } from "@typeit/discord";

export const NotABot: GuardFunction<"message"> = async (
  [message],
  client,
  next
) => {
  if (message.author.bot === false) {
    await next();
  }
}