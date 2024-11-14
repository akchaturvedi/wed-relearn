import mongoose, { schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new schema(
  {
    content: {
      type: String,
      required: true,
    },
    video: {
      type: schema.Types.ObjectId,
      ref: "Video",
    },
    owner: {
      type: schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.plugin(mongooseAggregatePaginate);
export const Comment = mongoose.model("Comment", commentSchema);
