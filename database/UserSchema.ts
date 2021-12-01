import * as mongoose from "mongoose";
import shortid from "shortid";

const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const UserSchema = new Schema({
  nickname: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },

  streamKey: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },

  authProviders: [
    {
      authName: {
        type: String,
        trim: true,
        required: true,
      },
      password: {
        type: String,
        trim: true,
        required: false,
      },
    },
  ],
  refreshSessions: [
    {
      refreshToken: {
        type: String,
        trim: true,
        required: true,
      },
      userAgent: {
        type: String,
        trim: true,
        required: true,
      },
      fingerprint: {
        type: String,
        trim: true,
        required: true,
      },
      expiresIn: {
        type: Number,
        required: true,
      },
      createdAt: {
        type: SchemaTypes.Date,
        required: true,
      },
    },
  ],
});

UserSchema.methods.generateStreamKey = () => {
  return shortid.generate();
};

export default UserSchema;
