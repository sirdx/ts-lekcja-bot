import { Command, CommandMessage, Guard } from "@typeit/discord";
import { MessageEmbed } from "discord.js";
import { NotABot } from "../guards/not-a-bot";

import * as BotConfig from "../../bot-config.json";

export abstract class Ping {
  @Command("ping")
  @Guard(NotABot)
  async ping(command: CommandMessage) {
    const ping = new Date().getTime() - command.createdTimestamp;

    command.channel.send({ embed:  
        new MessageEmbed()
        .setTitle("🏓 Pong!")
        .setDescription(`Czas odpowiedzi: ${ping} ms`)
        .setColor(BotConfig.embed.color)
        //.setFooter(BotConfig.embed.footer, Main.Client.user.avatarURL())
        //.setTimestamp(currentDate)
      }
    );
  }
}