import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StreamsService } from '../streams/streams.service';
import { ChattingsGateway } from './chattings.gateway';
import { ChattingsService } from './chattings.service';

@Module({
  imports: [AuthModule],
  providers: [ChattingsGateway, ChattingsService, StreamsService],
})
export class ChattingsModule {}
