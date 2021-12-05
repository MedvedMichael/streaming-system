import getAstrologicalToken from "helpers/get-astrological-token";
import { NewToken } from "interfaces/new-token";
import {
  FullChangeMyPasswordRoute,
  FullChangeStreamKeyRoute,
  FullMyProfileRoute,
  FullPatchMyProfileRoute,
  FullUserByIDRoute,
} from "interfaces/routes/user-routes";
import {
  IProfile,
  IProfileWithProviders,
  UserUpdates,
} from "interfaces/User.interface";
import { get, patch } from "./fetch-functions";


export async function getUserProfile(
  accessToken: string,
  userID: string
): Promise<IProfileWithProviders> {
  return (await get(
    FullUserByIDRoute + userID,
    accessToken
  )) as IProfileWithProviders;
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

export async function changeMyStreamKey(
  accessToken: string
): Promise<{ streamKey: string }> {
  const res = await patch(FullChangeStreamKeyRoute, {}, accessToken, true);
  return await res.json();
}
