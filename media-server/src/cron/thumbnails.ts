const CronJob = require("cron").CronJob;
// @ts-ignore
import * as request from "request";
import { generateStreamThumbnail } from "../helpers/helpers";
import config from "../config/default";
const port = config.rtmp_server.http.port;

const job = new CronJob(
  "*/5 * * * * *",
  function () {
    request.get(
      "http://127.0.0.1:" + port + "/api/streams",
      function (error: string, response: unknown, body: string) {
        let streams = JSON.parse(body);
        if (typeof (streams["live"] !== undefined)) {
          let live_streams = streams["live"];
          for (let stream in live_streams) {
            if (
              !live_streams.hasOwnProperty(stream) ||
              stream.split("_").length !== 1
            )
              continue;
            generateStreamThumbnail(stream);
          }
        }
      }
    );
  },
  null,
  true
);

export default job;
