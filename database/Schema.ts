import * as mongoose from "mongoose";
import IUser from "../client/src/interfaces/User.interface";
import IStream from "../client/src/interfaces/Stream.interface";
import UserSchema from "./UserSchema";
import StreamSchema from "./StreamSchema";

export const User = mongoose.model<IUser>("User", UserSchema);
export const Stream = mongoose.model<IStream>("Stream", StreamSchema);
