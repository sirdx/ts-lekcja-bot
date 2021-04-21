import { Command, CommandMessage } from "@typeit/discord";

export abstract class Ping {
  @Command("ping")
  async ping(command: CommandMessage) {
    command.reply("Pong!");
  }
}