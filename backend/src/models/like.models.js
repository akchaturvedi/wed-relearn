import mongoose, { schema } from "mongoose";

const likeSchema = new schema(
  {
    video: {
      type: schema.Types.ObjectId,
      ref: "Video",
    },
    comment: {
      type: schema.Types.ObjectId,
      ref: "Comment",
    },
    tweet: {
      type: schema.Types.ObjectId,
      ref: "Tweet",
    },
    likedBy: {
      type: schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likeSchema);
