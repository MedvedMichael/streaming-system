import * as mongoose from 'mongoose';
import IUser from '../client/src/interfaces/User.interface'
import UserSchema from './UserSchema'

export const User = mongoose.model<IUser>('User', UserSchema);
