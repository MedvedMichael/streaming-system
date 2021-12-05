import { forwardRef, Module } from '@nestjs/common';
import { StreamsService } from './streams.service';
import { StreamsController } from './streams.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [StreamsService],
  controllers: [StreamsController]
})
export class StreamsModule {}
