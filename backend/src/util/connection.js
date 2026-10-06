import mongoose from "mongoose"
import asyncHandler from "express-async-handler"
import { Pool } from "pg"
import { DB_URL } from "../conf/index.js"

// const connectDatabase = asyncHandler(async (DB_URL) => {
//   mongoose
//     .connect(DB_URL)
//     .then(() => console.log(`MongoDB connected`))
//     .catch((error) => console.log(`Error while connecting Database ${error}`))
// })

const pool = new Pool({ connectionString: DB_URL })

const connectDatabase = asyncHandler(async () => {
  try {
    const res = await pool.query('SELECT version()');
    console.log('Successfully connected to Neon DB!');
    console.log('Database version:', res.rows[0].version);
  } catch (err) {
    console.error('Error connecting to Neon:', err.message);
  } 
})

export { pool }

export default connectDatabase