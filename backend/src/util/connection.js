import mongoose from "mongoose"
import asyncHandler from "express-async-handler"

const connectDatabase = asyncHandler(async (DB_URL) => {
  mongoose
    .connect(DB_URL)
    .then(() => console.log(`MongoDB connected`))
    .catch((error) => console.log(`Error while connecting Database ${error}`))
})

export default connectDatabase