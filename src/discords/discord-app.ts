import * as Path from "path";
import { Discord, CommandNotFound, CommandMessage, On, ArgsOf, Client } from "@typeit/discord";

@Discord("t!", {
  import: [
    Path.join(__dirname, "..", "commands", "*.ts"),
    Path.join(__dirname, "..", "events", "*.ts")
  ]
})

@Discord("t!")
export class DiscordApp {
  @CommandNotFound()
  notFoundA(command: CommandMessage) {
    command.reply("Command not found!");
  }
}