import asyncHandler from "express-async-handler"
import { ApiResponse } from "../util/ApiResponse.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_SECRET, OAUTH_CLIENT_ID, OAUTH_SECRET, REFRESH_TOKEN_SECRET } from "../conf/index.js";
import { ApiError } from "../util/ApiError.js";
import axios from "axios"
import { google } from 'googleapis'

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
      locationPermission: !!(lat && lng), district: finalCity,
      state: finalRegion
    })

    if (!user) res.status(500).json("Error while creating user")

    const token = generateAccessAndRefreshToken(email, username, user._id)

    await User.updateOne({ _id: user._id }, { $set: { refreshToken: token.refreshToken } });

    return res.status(201).json(new ApiResponse(201, {
      token,
      user: {
        _id: user._id,
        username: user.username,
        gender: user.gender,
        status: user.status,
        subscription: user.subscription
      }
    }, "User created Successfully"))
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
      return res.status(200).json(new ApiResponse(200, {
        token,
        user: {
          _id: existingUser._id,
          username: existingUser.username,
          gender: existingUser.gender,
          status: existingUser.status,
          subscription: existingUser.subscription
        }
      }, "user login sucessfully"));
    } else {
      return res.status(401).json(new ApiResponse(401, null, "unauthorized access"));
    }
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    throw new ApiError(500, `error while login`, error);
  }
})

const oAuthLogin = asyncHandler(async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(OAUTH_CLIENT_ID, OAUTH_SECRET, "postmessage")

  const { code, lat, lng } = req.query;
  if (!code) return res.status(404).json(new ApiResponse(404, null, "code not present in quesry"))

  try {
    const response = await oauth2Client.getToken(code)

    oauth2Client.setCredentials(response.tokens)

    const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${response.tokens.access_token}`)

    const { name, email, picture, gender } = userRes.data;

    // find user if already exists otherwise create user
    let user = await User.findOne({ email })
    if (!user) {
      // check for lat and lng

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

      // create new user
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8) + "googleOauth", 10);
      user = await User.create({
        fullName: name, email, profilePhoto: picture || "", username: Math.random().toString(36), gender: gender || "male", password: randomPassword,
        location: lat && lng ? {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)]
        } : undefined,
        locationPermission: !!(lat && lng), district: finalCity, state: finalRegion
      })

      if (!user) return res.status(500).json(new ApiResponse(500, null, "Error while creating new user"))

      const token = generateAccessAndRefreshToken(email, user.username, user._id)
      user.refreshToken = token.refreshToken;
      await user.save()
      return res.status(201).json(new ApiResponse(201, {
        token,
        user: {
          _id: user._id,
          username: user.username,
          gender: user.gender,
          status: user.status,
          subscription: user.subscription
        }
      }, "User Created Successfully"))
    } else {
      const token = generateAccessAndRefreshToken(email, user.username, user._id)
      // update user data
      user.profilePhoto = response.photo;
      user.refreshToken = token.refreshToken;
      await user.save();
      return res.status(200).json(new ApiResponse(200, {
        token,
        user: {
          _id: user._id,
          username: user.username,
          gender: user.gender,
          status: user.status,
          subscription: user.subscription
        }
      }, "user login successfully throgh oauth"))
    }
  } catch (error) {
    throw new ApiError(500, "Error in oauth ", error)
  }
})

export {
  createUser,
  login,
  oAuthLogin
}