import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ScryptService } from '../scrypt/scrypt.service';
import { StreamsService } from '../streams/streams.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, StreamsService],
  exports: [UsersService],
})
export class UsersModule {}
