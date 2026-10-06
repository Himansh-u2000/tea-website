import mongoose from "mongoose"
import asyncHandler from "express-async-handler"
import { Pool } from "pg"

// const connectDatabase = asyncHandler(async (DB_URL) => {
//   mongoose
//     .connect(DB_URL)
//     .then(() => console.log(`MongoDB connected`))
//     .catch((error) => console.log(`Error while connecting Database ${error}`))
// })


const connectDatabase = asyncHandler(async (DB_URL) => {
  const pool = new Pool({ connectionString: DB_URL })
  try {
    const res = await pool.query('SELECT version()');
    console.log('Successfully connected to Neon DB!');
    console.log('Database version:', res.rows[0].version);
  } catch (err) {
    console.error('Error connecting to Neon:', err.message);
  } finally {
    await pool.end();
  }
})

export default connectDatabase