import mongoose, { schema } from "mongoose";

const playlistSchema = new schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
