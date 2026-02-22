import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  images: {
    type: [{ type: String }]
  },
  clappedBy: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  postUrl: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ["Point"]
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    }
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  },
  region: {
    type: String,
    index: true
  },
  locationPermission: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: true
})


postSchema.index({ location: "2dsphere" });

export const Post = mongoose.model("Post", postSchema)