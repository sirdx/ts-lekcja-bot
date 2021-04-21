export default interface MSTeamsMeeting {
  subject: string;
  organizerName: string;
  startTime: Date;
  endTime: Date;
  isCancelled: boolean;
  url: string;
}