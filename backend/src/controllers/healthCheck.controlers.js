import { apiResponse } from "../utils/apiResponese.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, "ok", "health check passed"));
});

export { healthCheck };
