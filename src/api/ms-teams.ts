import { APIConstants } from "./constants";
import * as Puppeteer from "puppeteer";
import Axios from "axios";

import * as BotConfig from "../../bot-config.json";
import MSTeamsMeeting from "./meeting";
import MSTeamsCalendar from "./calendar";
import MSTeamsCalendarSpace from "./calendar-space";

export default class MSTeams {
  private static log(log: string) {
    console.log(`[MST] ${log}`);
  }

  static async getCalendar(
    startDate: Date, 
    endDate: Date, 
    cookies?: Puppeteer.Protocol.Network.Cookie[]
    ): Promise<MSTeamsCalendarSpace[]> {
    return await new Promise<MSTeamsCalendarSpace[]>(async (resolve, reject) => {
      this.getMeetings(cookies ?? await this.getCookies(), startDate, endDate).then((meetings) => {
        resolve(MSTeamsCalendar.getCalendar([...meetings, ...MSTeamsCalendar.getCustomMeetings()]));
      }).catch(error => reject(error));
    });
  }

  static stringifyCookies(cookies: Puppeteer.Protocol.Network.Cookie[]): string {
    let data = "";

    cookies.forEach(cookie => {
      data += cookie.name + "=" + cookie.value + "; ";
    });

    return data;
  }

  static prepareAuth(auth: string): string {
    return auth.replace("%3D", " ").replace(APIConstants.mstAuthRemove, "");
  }

  static async getMeetings(
    cookies: Puppeteer.Protocol.Network.Cookie[], 
    startDate: Date, 
    endDate: Date
    ): Promise<MSTeamsMeeting[]> {
    return await new Promise<MSTeamsMeeting[]>(async (resolve, reject) => {
      this.log("Requesting calendar events...");

      Axios.get(`${APIConstants.mstUrl}${APIConstants.mstCalendar}?StartDate=${startDate.toISOString()}&EndDate=${endDate.toISOString()}`, {
        headers: {
          cookie: this.stringifyCookies(cookies),
          authorization: this.prepareAuth(await this.getAuthToken(cookies))
        }
      }).then((response) => {
        const data = response.data.value;
        let meetingArr: MSTeamsMeeting[] = [];

        data.forEach(m => {
          meetingArr.push({
            subject: m.subject,
            organizerName: m.organizerName,
            startTime: new Date(m.startTime),
            endTime: new Date(m.endTime),
            isCancelled: m.isCancelled,
            url: m.skypeTeamsMeetingUrl
          });
        });

        resolve(meetingArr);
      })
      .catch((error) => reject(error));
    });
  }

  static async getAuthToken(cookies?: Puppeteer.Protocol.Network.Cookie[]): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
      if (cookies) {
        resolve(cookies.find(c => c.name === APIConstants.mstAuthToken).value);
      }
      else {
        this.getCookies().then((response) => {
          resolve(response.find(c => c.name === APIConstants.mstAuthToken).value);
        })
        .catch((err) => reject(err));
      }
    });
  }

  static async getCookies(): Promise<Puppeteer.Protocol.Network.Cookie[]> { 
    return await new Promise(async (resolve, reject) => {
      this.log("Navigating to Teams...");

      try { 
        const browser = await Puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(APIConstants.mstUrl, { waitUntil: 'networkidle0' });
        this.log("Loaded Teams page!");
    
        await page.type(APIConstants.mstEmailSelector, process.env.MSTEAMS_EMAIL);
        await page.click(APIConstants.mstNextButton);
        await page.waitForTimeout(APIConstants.mstLoginDelay);
        this.log("E-mail stage passed!");
    
        await page.type(APIConstants.mstPasswordSelector, process.env.MSTEAMS_PASSWORD);
        await page.click(APIConstants.mstNextButton);
        await page.waitForTimeout(APIConstants.mstLoginDelay);
        this.log("Password stage passed!");
    
        await page.click(APIConstants.mstReminderButton);
        await page.waitForNavigation();
        await page.waitForTimeout(APIConstants.mstRedirectDelay);
        this.log("Teams should work now!");
    
        await page.cookies().then(cookies => {
          resolve(cookies);
        })
        .catch(err => reject(err))
        .finally(async () => {
          await browser.close();
        });
      }
      catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}