export type AuthProviderName = "local" | "google";

export interface IAuthProvider {
  authName: string;
  password?: string;
}

export interface IRefreshSession {
  refreshToken: string;
  userAgent: string;
  fingerprint: string;
  expiresIn: number;
  createdAt: Date;
}

export interface IProfile {
  _id: string;
  nickname: string;
  email: string;
  streamKey: string;
}

export interface IProfileWithProviders extends IProfile {
  authProviders: string[];
}

export default interface IUser extends IProfile {
  authProviders: IAuthProvider[];
  refreshSessions: IRefreshSession[];
}

export interface UserUpdates {
  nickname?: string;
  streamKey?: string;
}
