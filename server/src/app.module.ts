import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StreamsModule } from './modules/streams/streams.module';

@Module({
  imports: [UsersModule, AuthModule, StreamsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
