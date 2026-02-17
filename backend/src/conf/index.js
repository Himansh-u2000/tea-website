import dotenv from "dotenv";

dotenv.config({ path: "" })

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

export {
  PORT,
  JWT_SECRET,
  DB_URL,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  FRONTEND_URL
}