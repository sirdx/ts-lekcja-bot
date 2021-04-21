import MSTeamsMeeting from "./meeting";

export default interface MSTeamsCalendarSpace {
  startTime: Date;
  meetings: MSTeamsMeeting[];
}