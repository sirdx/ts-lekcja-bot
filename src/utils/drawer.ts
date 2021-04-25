import { Canvas, CanvasRenderingContext2D, loadImage } from "canvas";
import MSTeamsMeeting from "../api/meeting";

import * as BotConfig from "../../bot-config.json";

export default class Drawer {
  private static roundRect(x: number, y: number, w: number, h: number, r: number, ctx: CanvasRenderingContext2D): CanvasRenderingContext2D {
    if (w < 2 * r) {
      r = w / 2;
    }

    if (h < 2 * r) {
      r = h / 2;
    }

    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();

    return ctx;
  }

  static async generateCalendarReminder(meetings?: MSTeamsMeeting[]): Promise<Canvas> {
    return await new Promise<Canvas>(async (resolve, reject) => {
      let canvas = new Canvas(400, 200 + (meetings ? meetings.length : 0) * 60);
      let ctx = canvas.getContext("2d");
      const centerWidth = canvas.width / 2;
      const centerHeight = canvas.height / 2;
  
      // Background 
      ctx.fillStyle = "#21153d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      // Banner
      ctx.fillStyle = "#19102e";
      ctx.fillRect(0, 0, canvas.width, 100);

      const teamsIcon = await loadImage("./assets/favicon_white.png");
      ctx.drawImage(teamsIcon, centerWidth - 100 / 2, 0, 100, 100);

      ctx.textAlign = "center";

      // No meetings
      if (meetings === undefined) {
        ctx.font = "italic 20px Arial";
        ctx.fillStyle = "#dddddd";

        ctx.fillText("Something went wrong...", centerWidth, 155);
      }
      // Meetings
      else {
        ctx.font = "bold 20px Arial";
        ctx.fillStyle = "#eeeeee";
        ctx.fillText(BotConfig.translations.reminder.title, centerWidth, 130);

        ctx.font = "bold 16px Arial";
        const meetingsStart = meetings[0].startTime;
        ctx.fillText(`${BotConfig.translations.reminder.day} ${BotConfig.translations.days[meetingsStart.getDay()]} | ${meetingsStart.toTimeString().split(' ')[0].substr(0, 5)}`, centerWidth, 150);

        for (let i = 0; i < meetings.length; i++) {
          const y = 180 + i * 75;

          ctx.fillStyle = "#38226b";
          ctx = this.roundRect(25, y, canvas.width - 50, 50, 5, ctx);
          ctx.fill();

          ctx.font = "18px Arial";
          ctx.fillStyle = "#cccccc";
          ctx.textAlign = "left";
          const subject = meetings[i].subject.length > 35 ? meetings[i].subject.slice(0, 35 - 3) + "..." : meetings[i].subject;
          ctx.fillText(subject, 25 + 10, y + 5);

          ctx.font = "16px Arial";
          const org = meetings[i].organizerName.length > 35 ? meetings[i].organizerName.slice(0, 35 - 3) + "..." : meetings[i].organizerName;
          ctx.fillText(org, 25 + 10, y + 31);

          ctx.font = "bold 25px Arial";
          ctx.textAlign = "right";
          const minutes = (meetings[i].endTime.getTime() - meetings[i].startTime.getTime()) / (60 * 1000);
          ctx.fillText(minutes.toString(), canvas.width - 25 - 10, y + 33);
        }
      }
  
      resolve(canvas);
    });  
  }
}