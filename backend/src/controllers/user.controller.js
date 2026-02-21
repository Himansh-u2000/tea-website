import AsyncHandler from "express-async-handler";
import { ApiResponse } from "../util/ApiResponse.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../util/ApiError.js";
import bcrypt from "bcrypt"

const changePassword = AsyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) return res.status(400).json(new ApiResponse(400, null, "old and new password are required"))

  if (oldPassword === newPassword) return res.status(400).json(new ApiResponse(400, null, "new password must be different from old password"))

  const userId = req._id
  // first find id then check old password is correct or not
  try {
    const existingUser = await User.findById(req._id)

    if (!existingUser) return res.status(404).json(new ApiResponse(404, null, "user not found"))

    const isOldPasswordTrue = await bcrypt.compare(oldPassword, existingUser.password)
    if (!isOldPasswordTrue) return res.status(401).json(new ApiResponse(401, null, "old password is not correct"))

    const salt = Math.ceil(Math.random() * 10);
    const hashPassword = await bcrypt.hash(newPassword, salt)

    existingUser.set("password", hashPassword);
    await existingUser.save();

    // hash new password and save that, 
    // also create new access and refresh token

    return res.status(202).json(new ApiResponse(202,))
  } catch (error) {
    throw new ApiError(500, "error while changing password", error)
  }
})

const changeProfilePicture = AsyncHandler(async (req, res) => {
  const { userId, image } = req.body;

  if (!userId || !image) return res.status(400).json(new ApiResponse(400, null, "image and user id is required"))

  try {
    const existingUser = await User.findById(req._id)
    if (!existingUser) return res.status(404).json(new ApiResponse(404, null, "user not found"));

    existingUser.set("profilePhoto", image);
    await existingUser.save();
  } catch (error) {
    throw new ApiError(500, "error while updating profile picture", error)
  }
})

const verifyGender = AsyncHandler(async (req, res) => {
  const { governmentIdNumber, governmentIdImage, governmentIdType } = req.body;

  if (!governmentIdImage || !governmentIdNumber) return res.status(400).json(new ApiResponse(400, null, "government id number and image not found"))

  // send image to a llm with vision capacity and return true if id is valid otherwise return false
  // return res.status(406).json(new ApiResponse(406, null, "government id not valid"))

  try {
    const existingUser = await User.findById(req._id)
    if (!existingUser) return res.status(404).json(new ApiResponse(404, null, "user not found"))
    existingUser.set("governmentIdNumber", governmentIdNumber)
    existingUser.set("governmentIdType", governmentIdType)
    existingUser.set("governmentIdImage", governmentIdImage)
    existingUser.set("status", true)

    await existingUser.save();
  } catch (error) {
    throw new ApiError(500, "error while verifying gender", error)
  }
})

export {
  changePassword,
  changeProfilePicture,
  verifyGender
}