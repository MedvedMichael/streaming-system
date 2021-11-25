import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Res,
  Req,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import sendTokensPair, { cleanCookies } from 'src/helpers/send-tokens-pair';
import { AuthService } from './auth.service';
import GoogleResponse from './dto/google-response';
import fetch from 'node-fetch'
import {
  AuthRoute,
  GoogleParams,
  GoogleRoute,
  LoginParams,
  LoginRoute,
  LogoutRoute,
  RefreshTokensParams,
  RefreshTokensRoute,
  RegisterParams,
  RegisterRoute,
} from '@interfaces/routes/auth-routes';

const userAgentName = 'user-agent';
@Controller(AuthRoute)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(RegisterRoute)
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(
    @Body() registerDTO: RegisterParams,
    @Res({ passthrough: true }) response: Response,
    @Req() { headers }: Request,
  ): Promise<void> {
    const userAgent = String(headers[userAgentName]);
    const pair = await this.authService.register(registerDTO, 'local', userAgent);

    sendTokensPair(response, pair);
  }

  @Post(LoginRoute)
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(
    @Body() authDTO: LoginParams,
    @Res({ passthrough: true }) response: Response,
    @Req() { headers }: Request,
  ): Promise<void> {
    const userAgent = String(headers[userAgentName]);
    const pair = await this.authService.login(authDTO, userAgent, 'local');
    sendTokensPair(response, pair);
  }

  @Post(RefreshTokensRoute)
  async refreshTokens(
    @Body() { astrologicalToken }: RefreshTokensParams,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const { refreshToken: oldToken } = request.cookies;
    if (!oldToken) throw new UnauthorizedException('No refresh token');
    const pair = await this.authService.refreshTokens(oldToken, astrologicalToken);
    sendTokensPair(response, pair);
  }

  @Post(GoogleRoute)
  async googleAuth(
    @Body() body: GoogleParams,
    @Req() { headers }: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const userData = (await fetch(process.env.GOOGLE_RESOURCE_ID + body.tokenId).then(
      (res) => res.json(),
    )) as GoogleResponse;

    if (!userData.email_verified) {
      throw new BadRequestException('Not confirmed google account!');
    }
    const userAgent = String(headers[userAgentName]);
    const pair = await this.authService.googleAuth(
      userData,
      userAgent,
      body.astrologicalToken,
    );
    sendTokensPair(response, pair);
  }

  @Post(LogoutRoute)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const { refreshToken } = request.cookies;
    await this.authService.logout(refreshToken);
    cleanCookies(response);
  }
}
