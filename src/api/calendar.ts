import MSTeamsMeeting from "./meeting";
import MSTeamsCalendarSpace from "./calendar-space";

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
}