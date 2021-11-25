import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

import IUser, { UserUpdates } from '../User.interface';

export const UserRoute = 'user';
export const MyProfileRoute = 'me';
export const PatchMyProfileRoute = 'me';
export const UserByIDRoute = ':id';
export const GetRecommendationsRoute = 'recommendations';
export const ChangeMyPasswordRoute = 'password';

export const FullMyProfileRoute = `/${UserRoute}/${MyProfileRoute}`;
export const FullUserByIDRoute = `/${UserRoute}/`; // + userID
export const FullPatchMyProfileRoute = `/${UserRoute}/${PatchMyProfileRoute}`;
export const FullGetRecommendationsRoute = `/${UserRoute}/${GetRecommendationsRoute}`;
export const FullChangeMyPasswordRoute = `/${UserRoute}/${ChangeMyPasswordRoute}`;

export type MyProfileRouteResponse = {};
export type UserByIDRouteResponse = IUser;

export interface PatchMyProfileRouteProps {
  updates: UserUpdates;
}
export interface GetRecommendationsRouteQueryParams {
  sex?: boolean;
}

export class ChangeMyPasswordRouteProps {
  oldPassword!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  newPassword!: string;
  astrologicalToken!: string;
}
