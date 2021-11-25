import getAstrologicalToken from "helpers/get-astrological-token";
import { NewToken } from "interfaces/new-token";
import {
  FullChangeMyPasswordRoute,
  FullGetRecommendationsRoute,
  FullMyProfileRoute,
  FullPatchMyProfileRoute,
  FullUserByIDRoute,
} from "interfaces/routes/user-routes";
import User, { IProfile, IProfileWithProviders, UserUpdates } from "interfaces/User.interface";

export const getHeaders = (
  accessToken: string
): { "Content-Type": string; Authorization: string } => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
});

const get = async (path: string, accessToken: string): Promise<unknown> => {
  const res = await fetch(process.env.REACT_APP_SERVER_URL + path, {
    method: "GET",
    headers: getHeaders(accessToken),
  });
  if (!res.ok) {
    throw new Error("Error");
  }
  const result = await res.json();
  result.birthDate = result?.birthDate
    ? new Date(result.birthDate)
    : new Date();
  return result;
};

const patch = async (
  path: string,
  body: Record<string, unknown>,
  accessToken: string,
  cookies = false
): Promise<Response> => {
  const res = await fetch(process.env.REACT_APP_SERVER_URL + path, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: getHeaders(accessToken),
    credentials: cookies ? "include" : "omit",
  });
  if (!res.ok) {
    throw new Error("Error");
  }

  return res;
};

export async function getUserProfile(
  accessToken: string,
  userID: string
): Promise<IProfileWithProviders> {
  return (await get(FullUserByIDRoute + userID, accessToken)) as IProfileWithProviders;
}

export async function getMyProfile(accessToken: string): Promise<IProfile> {
  return (await get(FullMyProfileRoute, accessToken)) as IProfile;
}

export async function patchMyProfile(
  accessToken: string,
  updates: UserUpdates
): Promise<void> {
  await patch(FullPatchMyProfileRoute, { updates }, accessToken);
}

export async function changeMyPassword(
  accessToken: string,
  oldPassword: string,
  newPassword: string
): Promise<NewToken> {
  const astrologicalToken = await getAstrologicalToken();
  const res = await patch(
    FullChangeMyPasswordRoute,
    { oldPassword, newPassword, astrologicalToken },
    accessToken,
    true
  );

  return (await res.json()) as NewToken;
}
