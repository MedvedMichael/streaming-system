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

const post = async (
  path: string,
  body?: Record<string, unknown>,
): Promise<unknown> => {
  const res = await fetch(process.env.REACT_APP_SERVER_URL + path, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Invalid request');
  }
  return await res.json();
};

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
