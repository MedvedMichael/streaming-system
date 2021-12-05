export interface IMessage {
  postedBy: string;
  text: string;
  createdAt: Date;
}

export interface IMessageWithNickname extends IMessage {
  nickname: string;
}

export default interface IStream {
  _id: string;
  streamKey: string;
  name: string;
  messages: IMessage[];
}

export interface ServerStream {
  streamKey: string;
  name: string;
  streams: {
    name: string;
    info: {
      app: string;
      stream: string;
      clientId: string;
      connectCreated: string;
      bytes: number;
      ip: string;
      audio: {
        codec: string;
        profile: string;
        samplerate: number;
        channels: number;
      };
      video: {
        codec: string;
        width: number;
        height: number;
        profile: string;
        level: number;
        fps: number;
      };
    };
  }[];
}
