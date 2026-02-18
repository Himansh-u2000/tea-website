import asyncHandler from "express-async-handler"
import { ApiResponse } from "../util/ApiResponse.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../conf/index.js";
import { ApiError } from "../util/ApiError.js";
import axios from "axios"

const generateAccessAndRefreshToken = (email, username, _id) => {
  const refreshToken = jwt.sign({ email, username, _id }, REFRESH_TOKEN_SECRET, { expiresIn: "5d" });
  const accessToken = jwt.sign({ email, username, _id }, ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

  const token = { accessToken, refreshToken };

  if (!token) throw new ApiError(501, "error while creating access token");

  return token;
}

const createUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, username, gender, lat, lng } = req.body;

  if (!fullName || !username || !email || !password || [fullName, email, password, username].some((field) => field.trim() === "")) {
    return res.status(400).json(new ApiResponse(400, null, "input fields are missing"))
  }

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) return res.status(400).json(new ApiResponse(400, null, "user already exists"))
  } catch (error) {
    throw new ApiError(500, "Existing user", error)
  }

  let finalRegion;
  let finalCity;
  if (lat && lng) {
    const geoRes = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          lat,
          lon: lng,
          format: "json"
        }
      }
    );

    finalCity =
      geoRes.data.address.city ||
      geoRes.data.address.town ||
      geoRes.data.address.village ||
      "no city";

    finalRegion =
      geoRes.data.address.state || "no region";
  }

  console.log(finalRegion)
  const salt = Math.ceil(Math.random() * 10);
  const hashPassword = await bcrypt.hash(password, salt)

  try {
    const user = await User.create({
      email, username, fullName, password: hashPassword, gender,
      location: lat && lng ? {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)]
      } : undefined,
      locationPermission: !!(lat && lng)
    })

    if (!user) res.status(500).json("Error while creating user")

    const token = generateAccessAndRefreshToken(email, username, user._id)

    await User.updateOne({ _id: user._id }, { $set: { refreshToken: token.refreshToken } });

    return res.status(201).json(new ApiResponse(201, token, "User created Successfully"))
  } catch (error) {
    console.log(error)
    throw new ApiError(500, "error while creating user", error)
  }
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || [email, password].some((field) => field.trim() === "")) {
    return res.status(400).json("input fields are missing")
  }
  try {
    const existingUser = await User.findOne({ email });
    // console.log(existingUser)
    if (!existingUser) return res.status(404).json(new ApiResponse(404, null, "user does not exist"))

    const match = await bcrypt.compare(password, existingUser.password);
    if (match) {
      const token = generateAccessAndRefreshToken(email, existingUser.username, existingUser._id);
      await User.updateOne({ _id: existingUser._id }, { $set: { refreshToken: token.refreshToken } });
      return res.status(200).json(new ApiResponse(200, token, "user login sucessfully"));
    } else {
      return res.status(401).json(new ApiResponse(401, null, "unauthorized access"));
    }
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    throw new ApiError(500, `error while login`, error);
  }
})

const oAuthLogin = () => {

}

export {
  createUser,
  login
}