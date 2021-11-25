const NodeMediaServer = require("node-media-server")
import config from "./src/config/default"
import {User} from '../database/Schema'
import IUser from "@interfaces/User.interface"
import {generateStreamThumbnail} from "./src/helpers/helpers"
import thumbnail_generator from './src/cron/thumbnails';
  

const nms = new NodeMediaServer(config.rtmp_server);

const getStreamKeyFromStreamPath = (path: string) => {
  let parts = path.split("/");
  return parts[parts.length - 1];
};

nms.on("prePublish", async (id: string, StreamPath: string, args: unknown) => {
  const stream_key = getStreamKeyFromStreamPath(StreamPath);
  console.log(
    "[NodeEvent on prePublish]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );

  User.findOne({ stream_key: stream_key }, (err: string, user: IUser) => {
    if (!err) {
      if (!user) {
        let session = nms.getSession(id);
        session.reject();
      } else {
        generateStreamThumbnail(stream_key);
      }
    }
  });
});

nms.run();
// thumbnail_generator.start();