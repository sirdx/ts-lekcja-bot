import * as Path from "path";
import { Discord, CommandNotFound, CommandMessage } from "@typeit/discord";

import * as BotConfig from "../../bot-config.json";

@Discord(BotConfig.prefix, {
  import: [
    Path.join(__dirname, "..", "commands", "*.ts"),
    Path.join(__dirname, "..", "events", "*.ts")
  ]
})

@Discord(BotConfig.prefix)
export class DiscordApp {
  @CommandNotFound()
  notFoundA(command: CommandMessage) {
    command.reply("Command not found!");
  }
}