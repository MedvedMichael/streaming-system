import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginParams, RegisterParams } from '@interfaces/routes/auth-routes';
import { User } from '@database/Schema';
import { Document } from 'mongoose';
import { UsersService } from '../users/users.service';
import IUser, {
  AuthProviderName,
  IRefreshSession,
} from '@interfaces/User.interface';
import { ScryptService } from '../scrypt/scrypt.service';
import { v4 as uuid } from 'uuid';
import { RefreshSessionDTO } from '../refresh-sessions/dto/refresh-session.dto';
import AuthTokensPair from './dto/tokens-pair.dto';
import { JwtService } from '@nestjs/jwt';
import shortid from 'shortid';
import GoogleResponse from './dto/google-response';

@Injectable()
export class AuthService {
  private maxNumberOfSessions = 10;
  constructor(
    private usersService: UsersService,
    private scryptService: ScryptService,
    private jwtService: JwtService,
  ) {}

  async register(
    {
      password: pass,
      email,
      nickname,
      astrologicalToken: fingerprint,
    }: RegisterParams,
    authName: AuthProviderName,
    userAgent = '',
  ): Promise<AuthTokensPair> {
    const oldUser = await User.findOne({ $or: [{ email }, { nickname }] });
    if (oldUser) throw new BadRequestException('User exists!');
    const password =
      authName === 'local'
        ? await this.scryptService.hash(pass as string)
        : undefined;

    const user = await this.usersService.registerUser({ email, nickname });
    user.authProviders.push(
      password
        ? {
            authName,
            password,
          }
        : { authName },
    );
    // await this.usersService.registerUser({ email, nickname, userID });

    const { accessToken, refreshToken } = await this.createNewRefreshSession({
      user,
      userAgent,
      fingerprint,
    });

    return { accessToken, refreshToken };
  }

  async login(
    { email, password, astrologicalToken: fingerprint }: LoginParams,
    userAgent: string,
    authName: AuthProviderName,
  ): Promise<AuthTokensPair> {
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundException();

    const provider = user.authProviders.find((p) => p.authName === authName);
    if (!provider) {
      throw new NotFoundException();
    }
    const isValid =
      authName === 'local'
        ? await this.scryptService.verify(
            password as string,
            provider.password as string,
          )
        : true;

    if (!isValid) {
      throw new BadRequestException();
    }

    return await this.createNewRefreshSession({
      user,
      userAgent,
      fingerprint,
    });
  }

  async googleAuth(
    userData: GoogleResponse,
    userAgent: string,
    astrologicalToken: string,
  ): Promise<AuthTokensPair> {
    try {
      return await this.login(
        {
          email: userData.email,
          astrologicalToken,
        },
        userAgent ? userAgent : '',
        'google',
      );
    } catch (error: any) {
      if (error.status === 400) {
        throw new BadRequestException();
      }
      return await this.register(
        {
          email: userData.email,
          nickname: `${userData.family_name} ${userData.given_name}`,
          astrologicalToken,
        },
        'google',
        userAgent,
      );
    }
  }

  async logout(refreshToken: string): Promise<void> {
    const user = await User.findOne({
      'refreshSessions.refreshToken': refreshToken,
    });
    if (!user) throw new NotFoundException();

    user.refreshSessions = user.refreshSessions.filter(
      (session) => session.refreshToken !== refreshToken,
    );
    await user.save();
  }

  async createNewRefreshSession({
    user,
    fingerprint,
    userAgent,
  }: RefreshSessionDTO): Promise<AuthTokensPair> {
    const accessToken = this.jwtService.sign({ userID: user._id });
    const refreshToken = uuid();

    user.refreshSessions = user.refreshSessions.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );

    const oldSameSession = user.refreshSessions.find(
      (s) => s.fingerprint === fingerprint,
    );
    if (oldSameSession) {
      user.refreshSessions = user.refreshSessions.filter(
        (r) => r.fingerprint !== fingerprint,
      );
    }

    if (user.refreshSessions.length > this.maxNumberOfSessions - 1) {
      user.refreshSessions.splice(0, 1);
    }
    user.refreshSessions.push({
      refreshToken,
      fingerprint,
      expiresIn: 5.184e9,
      createdAt: new Date(),
      userAgent,
    });
    await user.save();
    return { accessToken, refreshToken };
  }

  async checkSession(
    refreshToken: string,
    fingerprint: string,
  ): Promise<{
    user: Document<any, any, IUser> & IUser;
    session: IRefreshSession;
  }> {
    const user = await User.findOne({
      'refreshSessions.refreshToken': refreshToken,
      'refreshSessions.fingerprint': fingerprint,
    });
    const session = user?.refreshSessions.find(
      (item) =>
        item.refreshToken === refreshToken && item.fingerprint == fingerprint,
    );
    if (!user || !session) {
      throw new UnauthorizedException('INVALID_TOKEN');
    }

    const { fingerprint: oldFingerprint, createdAt, expiresIn } = session;
    user.refreshSessions = user.refreshSessions.filter(
      (item) => item.refreshToken !== refreshToken,
    );

    const expiredDate = new Date(createdAt.getTime() + +expiresIn);
    const now = new Date();
    if (
      expiredDate.getTime() <= now.getTime() ||
      oldFingerprint !== fingerprint
    ) {
      throw new UnauthorizedException('INVALID_REFRESH_SESSION');
    }

    return { user, session };
  }

  async refreshTokens(
    refreshToken: string,
    fingerprint: string,
  ): Promise<AuthTokensPair> {
    const { user, session } = await this.checkSession(
      refreshToken,
      fingerprint,
    );
    session.userAgent;
    return await this.createNewRefreshSession({
      user,
      userAgent: session.userAgent,
      fingerprint: fingerprint,
    });
  }
}
