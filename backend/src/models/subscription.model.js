import mongoose from "mongoose";

const subscriptionScehma = new mongoose.Schema({
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true
  },
  price: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
})

export const Subscription = mongoose.model("Subscription", subscriptionScehma)