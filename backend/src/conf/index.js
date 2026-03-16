import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config({ path: "" })

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
const OAUTH_SECRET = process.env.OAUTH_SECRET;
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const STRIPE_SECRETKEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PRODUCT_ID = process.env.STRIPE_PRODUCT_ID;


const redisClient = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .on("connect", () => console.log("Redis Client Connected"))
  .connect();

export {
  PORT,
  JWT_SECRET,
  DB_URL,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  FRONTEND_URL,
  OAUTH_CLIENT_ID,
  OAUTH_SECRET,
  STRIPE_SECRETKEY,
  STRIPE_PRODUCT_ID,
  redisClient
}