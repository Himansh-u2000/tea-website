import mongoose, { Mongoose, Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  profilePhoto: {
    type: String,
    default: "defaultimgurl"
  },
  phone: {
    type: String
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true
  },
  subscription: {
    type: Schema.Types.ObjectId,
    ref: "Subscription"
  },
  governmentIdType: {
    type: String,
    enum: ["DL", "aadhar"]
  },
  posts: {
    type: [{ type: Schema.Types.ObjectId, ref: "post" }],
    min: 0
  },
  governmentIdNumber: {
    type: String
  },
  status: {
    type: String,
    enum: ["verified", "unverified"]
  },

  refreshToken: {
    type: String
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    }
  },
  region: {
    type: String,
    index: true
  },
  locationPermission: {
    type: Boolean,
    default: true
  },
  address: String,
  district: String,
  state: String
}, {
  timestamps: true
})

userSchema.index({ location: "2dsphere" });

export const User = mongoose.model("User", userSchema)