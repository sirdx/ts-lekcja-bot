import { Command, CommandMessage, Guard } from "@typeit/discord";
import { NotABot } from "../guards/not-a-bot";

export abstract class Ping {
  @Command("ping")
  @Guard(NotABot)
  async ping(command: CommandMessage) {
    command.reply("Pong!");
  }
}