import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponese.js";

const generateaccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  // Validation
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "User with email or username already exists");
  }

  console.warn(req.file);
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is missing");
  }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Uploaded on Cloudinary avatar successfully", avatar);
  } catch (error) {
    console.log("Error uploading avatar", error);
    throw new apiError(500, "Failed to upload avatar");
  }

  let coverImage = "";
  if (coverImageLocalPath) {
    try {
      coverImage = await uploadOnCloudinary(coverImageLocalPath);
      console.log(
        "Uploaded on Cloudinary cover image successfully",
        coverImage
      );
    } catch (error) {
      console.log("Error uploading cover image", error);
      throw new apiError(500, "Failed to upload cover image");
    }
  }

  try {
    const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshtoken"
    );

    if (!createdUser) {
      throw new apiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json(new apiResponse(201, createdUser, "User registered successfully"));
  } catch (error) {
    console.log("User creation failed", error);

    // Delete uploaded images from Cloudinary if any issue arises
    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }
    if (coverImage && coverImage.public_id) {
      await deleteFromCloudinary(coverImage.public_id);
    }

    throw new apiError(
      500,
      "Something went wrong while registering the user and images were deleted"
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  // get data from body
  const { email, username, password } = req.body;

  // validation
  if (!email) {
    throw new apiError(400, "email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new apiError(400, "user not found");
  }

  // validate password

  const isPasswordValid = await user.ispasswordCorrect(password);
  if (!isPasswordValid) {
    throw new apiError(400, "Invailid credentials");
  }

  const { accessToken, refreshToken } = await generateaccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password , -refreshToken"
  );

  if (!loggedInUser) {
    throw new apiError(400, "user is not logged in");
  }

  const options = {
    htttpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(200, {}, "user loggedout"));

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user logged in successfully"
      )
    );
});

const logOutUser = (asyncHandler = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );

  const options = {
    htttpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(401, "refresh token is required");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new apiError(401, "invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new apiError(401, "invalid refresh token");
    }
    const options = {
      htttpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accessToken, refreshToken: newRefreshtoken } =
      await generateaccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshtoken, options)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken: newRefreshtoken },
          "access token successfully"
        )
      );
  } catch (error) {
    throw new apiError(500, "something went wrong while refresh access token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);

  const isPasswordValid = await user.ispasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new apiError(402, "old password is incorrect");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new apiResponse(200, {}, "password change successfully"));
});
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, req.user, "current user details"));
});
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!fullname || !email) {
    throw new apiError(400, "fullname and email are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email: email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new apiResponse(200, user, "account details are updated successfully")
    );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new apiError(400, "file is required");
    const avatar = await uploadOnCloudinary(avatarLocalPath);
  }
  if (!avatar.url) {
    throw new apiError(502, "something went wrong while uploading avatar");
  }

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new apiResponse(200, user, "avatar updated successfully"));
});
const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new apiError(400, "file is required");
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  }
  if (!coverImage.url) {
    throw new apiError(502, "something went wrong while uploading coverImage");
  }

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new apiResponse(200, user, "coverImage updated successfully"));
});
const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username.trim()) {
    throw new apiError(402, "username is required");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscription",
        localField: "_id",
        foreignField: "channel",
        as: "subscriber",
      },
    },
    {
      $lookup: {
        from: "subscription",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedto",
      },
    },

    {
      $addFields: {
        subscriberCount: {
          $size: "$subscriber",
        },
        channelSubscribedToCount: {
          $size: "subscribedto",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscriber.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },

    {
      // project only the necessarydata
      $project: {
        fullname: 1,
        username: 1,
        avatar: 1,
        email: 1,
        coverImage: 1,
        isSubscribed: 1,
        subscriberCount: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new apiError(404, "channel not found");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, channel[0], "channel profile fetched sucessfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logOutUser,
  updateUserCoverImage,
  updateUserAvatar,
  updateAccountDetails,
  getCurrentUser,
  changeCurrentPassword,
  generateaccessAndRefreshToken,
  getUserChannelProfile,
  getWatchHistory,
};
