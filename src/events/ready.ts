import { On } from "@typeit/discord";
import { Main } from "../main";
import { ActivityType, MessageAttachment } from "discord.js";
import MSTeams from "../api/ms-teams";
import { TextChannel } from "discord.js";
import JobScheduler from "../utils/scheduler";
import Drawer from "../utils/drawer";
import Groups from "../utils/groups";

import * as BotConfig from "../../bot-config.json";

export abstract class Ready {
  @On("ready")
  async ready() {
    let presenceDuration = 0;
    BotConfig.settings.presences.forEach(p => presenceDuration += p.time);
    setInterval(() => this.changePresence(), presenceDuration * 1000);

    const currentDate = new Date();
    const calendar = await MSTeams.getCalendar(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
      new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
    );

    calendar.forEach(e => {
      JobScheduler.scheduleJob(e.startTime, async () => {
        const channel = Main.Client.channels.cache.get(BotConfig.settings.reminderCID) as TextChannel;
        const canvas = await Drawer.generateCalendarReminder(e.meetings);
        const mentions = Groups.getReminderMentions(e.meetings);

        channel.send(mentions, new MessageAttachment(canvas.toBuffer(), "meetings.png"));
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

    BotConfig.settings.presences.forEach(p => {
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