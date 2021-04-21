import { APIConstants } from "./constants";
import * as Puppeteer from "puppeteer";

import * as BotConfig from "../../bot-config.json";

export default class MSTeams {
  static log(log: string) {
    console.log(`[MST] ${log}`);
  }

  static async getAuthToken(): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
      this.getCookies().then((cookies) => {
        resolve(cookies.find(c => c.name == APIConstants.mstAuthToken).value);
      })
      .catch((err) => reject(err));
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