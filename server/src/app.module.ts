import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StreamsModule } from './modules/streams/streams.module';
import { join } from 'path';
import { ChattingsModule } from './modules/chattings/chattings.module';


@Module({
  imports: [
    UsersModule,
    AuthModule,
    StreamsModule,
    ChattingsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
