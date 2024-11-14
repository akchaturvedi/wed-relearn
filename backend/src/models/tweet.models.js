import mongoose, { schema } from "mongoose";

const tweetSchema = new schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Tweet = mongoose.model("Tweet", tweetSchema);
