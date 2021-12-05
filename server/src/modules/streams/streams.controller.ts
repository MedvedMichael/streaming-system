import IStream, { ServerStream } from '@interfaces/Stream.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtValidationOutput } from '../auth/strateries/jwt.strategy';
import { UsersService } from '../users/users.service';
import { StreamsService } from './streams.service';
import {ChangeStreamNameRoute, GetAllStreamsRoute, StreamsRoute} from '@interfaces/routes/stream-routes'

@Controller(StreamsRoute)
export class StreamsController {
  constructor(
    private streamsService: StreamsService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/new')
  async createNewStream(
    @Headers('authorization') auth: string,
    @Body('streamKey') streamKey: string,
  ): Promise<{ created: boolean }> {
    if (auth !== process.env.MEDIA_SERVER_SECRET)
      throw new UnauthorizedException();
    // console.log(body)
    return this.streamsService.createStream(streamKey);
  }

  @UseGuards(JwtAuthGuard)
  @Get(GetAllStreamsRoute)
  async getServerStreams(): Promise<ServerStream[]> {
    return this.streamsService.fetchStreamsData();
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Delete('/remove')
  async deleteStream(
    @Headers('authorization') auth: string,
    @Body('streamKey') streamKey: string,
  ): Promise<void> {
    if (auth !== process.env.MEDIA_SERVER_SECRET)
      throw new UnauthorizedException();

    this.streamsService.deleteStream(streamKey);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch(ChangeStreamNameRoute)
  async changeStreamName(
    @Request() { user }: JwtValidationOutput,
    @Body('name') newName: string,
  ): Promise<void> {
    const oldUser = await this.usersService.getProfile(user.userID);
    this.streamsService.changeStreamName(newName, oldUser.streamKey);
  }
}
