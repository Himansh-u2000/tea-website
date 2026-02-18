import AsyncHandler from "express-async-handler";
import { ACCESS_TOKEN_SECRET } from "../conf/index.js";
import { ApiError } from "../util/ApiError.js";
import jwt from "jsonwebtoken"
import { ApiResponse } from "../util/ApiResponse.js";

const verifyJWT = AsyncHandler(async (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) return res.status(401).json(new ApiResponse(401, null, "Token not found"))

  token = token.split(" ")[1]
  try {
    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET)
    if (!decodedToken) return res.status(401).json(new ApiResponse(401, null, "Access Token Expired"))
    next()
  } catch (error) {
    return res.status(401).json(new ApiResponse(401, null, "Invalid or expired token"));
  }
})


export {
  verifyJWT
};
