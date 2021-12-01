const NodeMediaServer = require("node-media-server");
import config from "./src/config/default";
import { User } from "../database/Schema";
import IUser from "@interfaces/User.interface";
import { generateStreamThumbnail } from "./src/helpers/helpers";
import thumbnail_generator from "./src/cron/thumbnails";
import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
import fetch from 'node-fetch'

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGODB_URL as string);
  const nms = new NodeMediaServer(config.rtmp_server);

  const getStreamKeyFromStreamPath = (path: string) => {
    let parts = path.split("/");
    return parts[parts.length - 1];
  };

  nms.on(
    "prePublish",
    async (id: string, StreamPath: string, args: unknown) => {
      let streamKey = getStreamKeyFromStreamPath(StreamPath);
      console.log(
        "[NodeEvent on prePublish]",
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
      );

      const user = User.findOne({ streamKey });

      if (!user) {
        let session = nms.getSession(id);
        session.reject();
        return;
      }

      const res = await fetch(`${process.env.SERVER_URL}/streams/new`, {
        method: "POST",
        body: JSON.stringify({
          streamKey,
        }),
        headers: {
          Authorization: `${process.env.MEDIA_SERVER_SECRET}`,
        },
      });

      if(!res.ok) {
        let session = nms.getSession(id);
        session.reject();
        return;
      }

      // generateStreamThumbnail(streamKey);
    }
  );

  console.log("Media server is up!");
  nms.run();
})();

// thumbnail_generator.start();
