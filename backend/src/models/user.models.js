import mongoose, { schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      require: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudnary url
      require: true,
    },
    coverimage: {
      type: String, //cloudnary url
    },
    watchhistry: [
      {
        type: schema.type.objectId,
        ref: "video",
      },
    ],

    password: {
      type: String,
      require: [true, "password is required"],
    },

    refreshtoken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.modified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.isPasswordCorrect=async function(password){
   return await.bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken= function(){
    // short lived access token (jwt token)
   return jwt.sign({
        _id:this._id;
        email:this.email;
        username:this.username;
        fullname:this.fullname
    },
process.env.ACCESS_TOKEN_SECRET,
{expiredIn:process.env.ACCESS_TOKEN_EXPIRY})
}
userSchema.methods.generateRefreshToken= function(){
    // short lived access token (jwt token)
   return jwt.sign({
        _id:this._id;
    },
process.env.REFRESH_TOKEN_SECRET,
{expiredIn:process.env.REFRESH_TOKEN_EXPIRY})
}


export const User = mongoose.model("User", userSchema);
