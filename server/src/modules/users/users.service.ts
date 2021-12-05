import { User } from '@database/Schema';
import IUser, {
  IProfile,
  IProfileWithProviders,
  UserUpdates,
} from '@interfaces/User.interface';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as shortid from 'shortid';
import { AuthService } from '../auth/auth.service';
import { RegisterData } from '../auth/dto/register.dto';
import { v4 as uuid } from 'uuid';
import { Document } from 'mongoose';
import AuthTokensPair from '../auth/dto/tokens-pair.dto';
import { ScryptService } from '../scrypt/scrypt.service';
import { StreamsService } from '../streams/streams.service';

@Injectable()
export class UsersService {
  tableName = 'Users';

  constructor(
    private scryptService: ScryptService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private streamsService: StreamsService,
  ) {}

  async registerUser({
    email,
    nickname,
  }: RegisterData): Promise<Document<any, any, IUser> & IUser> {
    const user = new User();
    user.email = email;
    user.nickname = nickname;
    user.streamKey = shortid.generate();
    user.refreshSessions = [];
    user.authProviders = [];
    return user;
  }

  async findByEmailOrNickname(email: string, nickname: string): Promise<IUser> {
    const user = await User.findOne({ $or: [{ email }, { nickname }] });
    if (!user) throw new NotFoundException();
    return user;
  }

  async getUser(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  async getProfile(id: string): Promise<IProfileWithProviders> {
    const user = await this.getUser(id);

    const { _id, email, nickname, streamKey } = user;
    return {
      _id,
      email,
      nickname,
      streamKey,
      authProviders: user.authProviders.map((item) => item.authName),
    };
  }

  async patchUser(_id: string, updates: UserUpdates): Promise<void> {
    await User.updateOne({ _id }, updates);
  }

  async changePassword(
    userID: string,
    oldPassword: string,
    newPassword: string,
    fingerprint: string,
    userAgent: string,
  ): Promise<AuthTokensPair> {
    const user = await User.findById(userID);
    if (!user) throw new NotFoundException();

    const providerIndex = user.authProviders.findIndex(
      (provider) => provider.authName === 'local',
    );

    if (providerIndex === -1) throw new BadRequestException();

    const isValid = await this.scryptService.verify(
      oldPassword,
      user.authProviders[providerIndex]?.password as string,
    );
    if (!isValid) {
      throw new BadRequestException();
    }

    user.refreshSessions = [];

    const newPass = await this.scryptService.hash(newPassword);
    user.authProviders[providerIndex].password = newPass;

    return await this.authService.createNewRefreshSession({
      user,
      fingerprint,
      userAgent,
    });
  }

  async changeStreamKey(userID: string): Promise<{ streamKey: string }> {
    const user = await User.findById(userID);
    if (!user) throw new UnauthorizedException();

    await this.streamsService.deleteStream(user.streamKey);

    const newStreamKey = shortid.generate();
    user.streamKey = newStreamKey;

    await user.save();
    return { streamKey: user.streamKey };
  }
}
