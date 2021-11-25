import IUser from "@interfaces/User.interface";
import { Document } from "mongoose";

export interface RefreshSessionDTO {
  user: Document<any, any, IUser> &  IUser;
  fingerprint: string;
  userAgent: string;
}

export default interface Session extends RefreshSessionDTO {
  refreshToken: string;
  expiresIn: number;
  createdAt: Date;
}
