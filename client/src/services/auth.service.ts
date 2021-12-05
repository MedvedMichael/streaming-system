import { GoogleLoginResponse } from 'react-google-login';
import getAstrologicalToken from 'helpers/get-astrological-token';
import { NewToken } from 'interfaces/new-token';
import {
  FullGoogleRoute,
  FullLoginRoute,
  FullLogoutRoute,
  FullRefreshTokensRoute,
  FullRegisterRoute,
} from 'interfaces/routes/auth-routes';
import { post } from './fetch-functions';


export async function login(
  email: string,
  password: string,
): Promise<NewToken> {
  const astrologicalToken = await getAstrologicalToken();
  return (await post(FullLoginRoute, {
    email,
    password,
    astrologicalToken,
  })) as NewToken;
}

export async function logout(): Promise<void> {
  await post(FullLogoutRoute);
}
export async function register(
  nickname: string,
  email: string,
  password: string,
): Promise<NewToken> {
  const astrologicalToken = await getAstrologicalToken();
  return (await post(FullRegisterRoute, {
    nickname,
    email,
    password,
    astrologicalToken,
  })) as NewToken;
}

export async function refresh(): Promise<NewToken> {
  const astrologicalToken = await getAstrologicalToken();
  return (await post(FullRefreshTokensRoute, {
    astrologicalToken,
  })) as NewToken;
}

export async function responseGoogle(
  res: GoogleLoginResponse,
): Promise<NewToken> {
  return (await post(FullGoogleRoute, {
    tokenId: res.tokenId,
    astrologicalToken: await getAstrologicalToken(),
  })) as NewToken;
}
