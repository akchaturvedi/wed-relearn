import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import User from "../models/user.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponese.js";

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

export { registerUser };
