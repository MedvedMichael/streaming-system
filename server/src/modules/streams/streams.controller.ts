import IStream from '@interfaces/Stream.interface';
import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StreamsService } from './streams.service';

@Controller('streams')
export class StreamsController {
  constructor(private streamsService: StreamsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAllStreams(): Promise<IStream[]> {
    return this.streamsService.getStreams();
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/new')
  async createNewStream(
    @Headers('authorization') auth: string,
    @Body('streamKey') streamKey: string,
  ): Promise<void> {
    if (auth !== process.env.MEDIA_SERVER_SECRET)
      throw new UnauthorizedException();

    this.streamsService.createStream(streamKey)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/remove')
  async deleteStream(
    @Headers('authorization') auth: string,
    @Body('streamKey') streamKey: string,
  ): Promise<void> {
    if (auth !== process.env.MEDIA_SERVER_SECRET)
      throw new UnauthorizedException();

    this.streamsService.deleteStream(streamKey)
  }
}
