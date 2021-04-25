import { CronCommand, CronJob } from "cron";

import * as BotConfig from "../../bot-config.json";

export default class JobScheduler {
  static scheduleJob(date: Date, job: CronCommand): CronJob {
    return new CronJob(`0 ${date.getMinutes()} ${date.getHours()} * * *`, job, null, true, BotConfig.settings.timezone);
  }
}