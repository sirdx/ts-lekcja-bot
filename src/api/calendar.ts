import MSTeamsMeeting from "./meeting";
import MSTeamsCalendarSpace from "./calendar-space";

import * as BotConfig from "../../bot-config.json";

export default class MSTeamsCalendar {
  static getCalendar(meetings: MSTeamsMeeting[]): MSTeamsCalendarSpace[] {
    let calendar: MSTeamsCalendarSpace[] = [];

    meetings.forEach(m => {
      if (m.isCancelled) {
        return;
      }

      let calendarSpace = calendar.findIndex(c => c.startTime.getTime() === m.startTime.getTime());
      if (calendarSpace === -1) {
        calendar.push({
          startTime: m.startTime,
          meetings: [m]
        });
      }
      else {
        calendar[calendarSpace].meetings.push(m);
      }
    });

    return calendar;
  }

  static getCustomMeetings(): MSTeamsMeeting[] {
    let meetings: MSTeamsMeeting[] = [];
    const currentDate = new Date();

    BotConfig.custom.forEach(m => {
      if (m.day !== currentDate.getDay()) {
        return;
      }

      meetings.push({
        subject: m.subject,
        organizerName: m.organizerName,
        startTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), m.startTime.hour, m.startTime.minutes),
        endTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), m.endTime.hour, m.endTime.minutes),
        isCancelled: false,
        url: m.url
      });
    });

    return meetings;
  }
}