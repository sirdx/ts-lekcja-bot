import MSTeamsMeeting from "../api/meeting";

import * as BotConfig from "../../bot-config.json";

export default class Groups {
  static getReminderMentions(meetings: MSTeamsMeeting[]): string {
    let mentions = BotConfig.settings.defaultPing;

    let menArr: string[] = [];
    if (BotConfig.groups.length > 0) {
      BotConfig.groups.forEach(g => {
        meetings.forEach(m => {
          const lowerSub = m.subject.toLowerCase();
          const lowerOrg = m.organizerName.toLowerCase();

          g.keywords.forEach(k => {
            if (lowerSub.includes(k) || lowerOrg.includes(k)) {
              if (!menArr.includes(g.roleID)) {
                menArr.push(g.roleID);
              }
            }
          });
        });
      });
    }

    if (menArr.length > 0) {
      mentions = "";
      menArr.forEach(m => {
        mentions += `<@&${m}> `;
      });
    }

    return mentions;
  }
}