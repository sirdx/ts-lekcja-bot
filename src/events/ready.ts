import { On } from "@typeit/discord";
import { Main } from "../main";

import * as BotConfig from "../../bot-config.json";
import { ActivityType } from "discord.js";
import MSTeams from "../api/ms-teams";

export abstract class Ready {
  @On("ready")
  async ready() {
    let presenceDuration = 0;
    BotConfig.presences.forEach(p => presenceDuration += p.time);
    setInterval(() => this.changePresence(), presenceDuration * 1000);

    let cal = await MSTeams.getCalendar(new Date(2021, 3, 21), new Date(2021, 3, 22), await MSTeams.getCookies());

    console.log("Bot ready!");
  }

  private changePresence() {
    let first = true;

    BotConfig.presences.forEach(p => {
      setTimeout(() => {
        Main.Client.user.setPresence({
          activity: {
            type: p.type as ActivityType,
            name: p.name
          }
        })
      }, first ? 0 : p.time * 1000);

      first = false;
    });
  }
}