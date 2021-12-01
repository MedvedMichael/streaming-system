import { Stream } from '@database/Schema';
import IStream from '@interfaces/Stream.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StreamsService {
  async deleteStream(streamKey: string) {
    await Stream.findOneAndDelete({streamKey})
  }
  async createStream(streamKey: string) {
    await this.deleteStream(streamKey)
    
    const stream = new Stream()
    stream.streamKey = streamKey

    await stream.save()
  }
  
  async getStreams(params: Partial<IStream> = {}): Promise<IStream[]> {
    return await Stream.find(params)
  }
}
