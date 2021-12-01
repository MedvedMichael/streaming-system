import { Schema } from "mongoose";

const StreamSchema = new Schema({
  streamKey: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  name: {
    type: String,
    trim: true,
    default: "Stream Name",
  },
  messages: [
    {
      type: new Schema(
        {
          postedBy: { type: Schema.Types.ObjectId, ref: "User" },
          text: {
            type: String,
            trim: true,
            required: true,
          },
        },
        { timestamps: true }
      ),
      default: [],
    },
  ],
});

export default StreamSchema;
