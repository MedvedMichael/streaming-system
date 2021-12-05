import { Stream } from '@database/Schema';
import IStream, {
  IMessage,
  IMessageWithNickname,
  ServerStream,
} from '@interfaces/Stream.interface';
import IUser from '@interfaces/User.interface';
import {
  forwardRef,
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import fetch from 'node-fetch';
import { UsersService } from '../users/users.service';
@Injectable()
export class StreamsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async deleteStream(streamKey: string) {
    await Stream.findOneAndDelete({ streamKey });
  }
  async createStream(streamKey: string): Promise<{ created: boolean }> {
    try {
      await this.getStreamByKey(streamKey);
      return { created: false };
    } catch {
      const newStream = new Stream();
      newStream.streamKey = streamKey;
      await newStream.save();
      return { created: true };
    }
  }

  async getStreams(params: Partial<IStream> = {}): Promise<IStream[]> {
    return await Stream.find(params);
  }

  async getStreamByKey(streamKey: string) {
    const stream = await Stream.findOne({ streamKey });
    if (!stream) throw new NotFoundException();
    return stream;
  }

  async changeStreamName(streamKey: string, newName: string) {
    const stream = await this.getStreamByKey(streamKey);
    stream.name = newName;

    await stream.save();
  }

  async getStreamChat(streamKey: string): Promise<IMessageWithNickname[]> {
    const stream = await this.getStreamByKey(streamKey);
    const { messages } = stream;
    const users: IUser[] = [];
    const chat: IMessageWithNickname[] = [];
    for await (const message of messages) {
      const user: IUser =
        users.find((u) => u._id == message.postedBy) ||
        (await this.usersService.getUser(message.postedBy));
      const { text, postedBy, createdAt } = message;
      chat.push({ text, postedBy, createdAt, nickname: user.nickname });
    }

    return chat.sort((a, b) => b.createdAt > a.createdAt ? 1 : -1);
  }

  async addNewMessage(message: Partial<IMessage>, streamKey: string) {
    const stream = await this.getStreamByKey(streamKey);
    //@ts-ignore
    stream.messages.push(message);

    await stream.save();
  }

  async fetchStreamsData(): Promise<ServerStream[]> {
    const res = await fetch(`${process.env.MEDIA_SERVER_URL}/api/streams`);
    const result = await res.json();

    const { live: data } = result;

    const streamsData: ServerStream[] = [];
    if (data) {
      for await (const key of Object.keys(data)) {
        const nameParts = key.split('_');
        const streamKey = nameParts[0];
        const oldObj = streamsData.find((o) => o.streamKey === streamKey);
        if (!oldObj) {
          const stream = await this.getStreamByKey(streamKey);
          streamsData.push({
            streamKey,
            name: stream.name,
            streams: [
              {
                name: key,
                info: data[key].publisher,
              },
            ],
          });
        } else {
          oldObj.streams.push({
            name: key,
            info: data[key].publisher,
          });
        }
      }
    }
    return streamsData;
  }
}
