import { On } from "@typeit/discord";
import { Main } from "../main";
import { ActivityType } from "discord.js";
import MSTeams from "../api/ms-teams";
import { TextChannel } from "discord.js";
import JobScheduler from "../utils/scheduler";

import * as BotConfig from "../../bot-config.json";

export abstract class Ready {
  @On("ready")
  async ready() {
    let presenceDuration = 0;
    BotConfig.presences.forEach(p => presenceDuration += p.time);
    setInterval(() => this.changePresence(), presenceDuration * 1000);

    const calendar = await MSTeams.getCalendar(new Date(2021, 3, 21), new Date(2021, 3, 22));

    calendar.forEach(e => {
      JobScheduler.scheduleJob(e.startTime, () => {
        const channel = Main.Client.channels.cache.get(BotConfig.settings.reminder_cid) as TextChannel;
        channel.send("Lekcja!");
      });
      this.log("New job scheduled!");
    });

    this.log("Ready!");
  }

  private log(log: string) {
    console.log(`[BOT] ${log}`);
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