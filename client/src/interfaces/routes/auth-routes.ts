import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export const AuthRoute = 'auth';
export const LoginRoute = 'login';
export const RegisterRoute = 'register';
export const RefreshTokensRoute = 'refresh-tokens';
export const GoogleRoute = 'google';
export const LogoutRoute = 'logout';

export const FullLoginRoute = `/${AuthRoute}/${LoginRoute}`;
export const FullRegisterRoute = `/${AuthRoute}/${RegisterRoute}`;
export const FullRefreshTokensRoute = `/${AuthRoute}/${RefreshTokensRoute}`;
export const FullGoogleRoute = `/${AuthRoute}/${GoogleRoute}`;
export const FullLogoutRoute = `/${AuthRoute}/${LogoutRoute}`;

export class LoginParams {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password?: string;

  @IsString()
  astrologicalToken!: string;
}

export class RegisterParams extends LoginParams {
  @IsString()
  nickname!: string;
}

export interface RefreshTokensParams {
  astrologicalToken: string;
}

export interface GoogleParams {
  accessToken: string;
  tokenId: string;
  astrologicalToken: string;
}
