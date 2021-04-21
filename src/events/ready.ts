import { On } from "@typeit/discord";
import { Main } from "../main";

export abstract class Ready {
  @On("ready")
  async ready() {


    setInterval(() => this.changeStatus(), 20 * 1000);

    console.log("Bot ready!");
  }

  private changeStatus() {
    Main.Client.user.setPresence({
      activity: {
        type: "WATCHING",
        name: "TypeScript"
      }
    });

    setTimeout(() => {
      Main.Client.user.setPresence({
        activity: {
          type: "PLAYING",
          name: "v2.0"
        }
      });
    }, 10 * 1000);
  }
}