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
  posts: {
    type: [{ type: Schema.Types.ObjectId, ref: "post" }],
    min: 0
  },
  governmentIdType: {
    type: String,
    enum: ["DL", "aadhar"]
  },
  governmentIdNumber: {
    type: String,
    min: 4
  },
  governmentIdImage: {
    type: String,
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
  district: String,
  state: String
}, {
  timestamps: true
})

userSchema.index({ location: "2dsphere" });

export const User = mongoose.model("User", userSchema)