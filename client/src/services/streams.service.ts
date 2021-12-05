import {
  FullChangeStreamNameRoute,
  FullGetAllStreamsRoute,
} from "interfaces/routes/stream-routes";
import { ServerStream } from "interfaces/Stream.interface";
import { get, patch } from "./fetch-functions";

export const getStreamsData = async (
  accessToken: string
): Promise<ServerStream[]> => {
  return (await get(FullGetAllStreamsRoute, accessToken)) as ServerStream[];
};

export const changeMyStreamName = async (accessToken: string, name: string) => {
  return await patch(FullChangeStreamNameRoute, { name }, accessToken);
};
