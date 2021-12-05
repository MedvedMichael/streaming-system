import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ScryptService } from '../scrypt/scrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strateries/jwt.strategy';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { StreamsService } from '../streams/streams.service';

require('dotenv').config();

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  providers: [
    AuthService,
    ScryptService,
    UsersService,
    JwtStrategy,
    StreamsService,
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    ScryptService,
    UsersService,
    JwtModule,
    JwtStrategy,
    StreamsService,
  ],
})
export class AuthModule {}
