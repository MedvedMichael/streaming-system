import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { UsersService } from './users.service';
import {
  ChangeMyPasswordRoute,
  ChangeMyPasswordRouteProps,
  ChangeStreamKeyRoute,
  GetRecommendationsRoute,
  GetRecommendationsRouteQueryParams,
  MyProfileRoute,
  MyProfileRouteResponse,
  PatchMyProfileRoute,
  UserByIDRoute,
  UserByIDRouteResponse,
  UserRoute,
} from '@interfaces/routes/user-routes';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtValidationOutput } from '../auth/strateries/jwt.strategy';
import {
  IProfile,
  IProfileWithProviders,
  UserUpdates,
} from '@interfaces/User.interface';
import sendTokensPair from 'src/helpers/send-tokens-pair';
import { JwtService } from '@nestjs/jwt';

@Controller(UserRoute)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(MyProfileRoute)
  async getMyProfile(
    @Request() { user }: JwtValidationOutput,
    @Request() req: ExpressRequest,
  ): Promise<IProfileWithProviders> {
    return await this.usersService.getProfile(user.userID);
  }

  @UseGuards(JwtAuthGuard)
  @Get(UserByIDRoute)
  async getUserGyID(@Param('id') id: string): Promise<IProfile> {
    return await this.usersService.getProfile(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(PatchMyProfileRoute)
  async patchUserProfile(
    @Request() { user }: JwtValidationOutput,
    @Body('updates') updates: UserUpdates,
  ): Promise<void> {
    await this.usersService.patchUser(user.userID, updates);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch(ChangeMyPasswordRoute)
  async changePassword(
    @Request() { user }: JwtValidationOutput,
    @Body()
    { oldPassword, newPassword, astrologicalToken }: ChangeMyPasswordRouteProps,
    @Req() { headers }: ExpressRequest,
    @Res() res: Response,
  ): Promise<void> {
    const userAgent = String(headers['user-agent']);
    const pair = await this.usersService.changePassword(
      user.userID,
      oldPassword,
      newPassword,
      astrologicalToken,
      userAgent,
    );

    sendTokensPair(res, pair);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch(ChangeStreamKeyRoute)
  async changeStreamKey(
    @Request() { user }: JwtValidationOutput,
  ): Promise<{ streamKey: string }> {
    return await this.usersService.changeStreamKey(user.userID);
  }
}
