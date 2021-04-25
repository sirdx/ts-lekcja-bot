import * as DotENV from "dotenv";
DotENV.config();

import * as Path from "path";
import { Client } from "@typeit/discord";

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static start() {
    this._client = new Client();
    this._client.options.ws.properties.$browser = "Discord Android";

    this._client.login(
      process.env.BOT_TOKEN,
      Path.join(__dirname, "discords", "*.ts"),
      Path.join(__dirname, "discords", "*.js")
    );
  }
}

Main.start();