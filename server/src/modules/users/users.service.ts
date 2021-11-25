import { User } from '@database/Schema';
import IUser, { IProfile, IProfileWithProviders, UserUpdates } from '@interfaces/User.interface';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as shortid from 'shortid';
import { AuthService } from '../auth/auth.service';
import { RegisterData } from '../auth/dto/register.dto';
import { v4 as uuid } from 'uuid';
import { Document } from 'mongoose';
import AuthTokensPair from '../auth/dto/tokens-pair.dto';
import { ScryptService } from '../scrypt/scrypt.service';

@Injectable()
export class UsersService {
  tableName = 'Users';

  constructor(
    private scryptService: ScryptService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async registerUser({
    email,
    nickname,
  }: RegisterData): Promise<Document<any, any, IUser> & IUser> {
    const user = new User();
    user.userID = uuid();
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

  async getProfile(userID: string): Promise<IProfileWithProviders> {
    const user = await User.findOne({ userID });
    if (!user) throw new NotFoundException();

    const { email, nickname, streamKey } = user;
    return {
      userID,
      email,
      nickname,
      streamKey,
      authProviders: user.authProviders.map((item) => item.authName),
    };
  }

  async patchUser(email: string, updates: UserUpdates): Promise<void> {
    await User.updateOne({ email }, updates);
  }

  async changePassword(
    userID: string,
    oldPassword: string,
    newPassword: string,
    fingerprint: string,
    userAgent: string,
  ): Promise<AuthTokensPair> {
    const user = await User.findOne({ userID });
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
}
