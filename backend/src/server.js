import express from "express"
import { PORT, DB_URL, FRONTEND_URL } from "./conf/index.js"
import connectDatabase from "./util/connection.js";
import authRouter from "./routes/auth.router.js";
import { postRouter } from "./routes/post.router.js";
import errorHandler from "./middleware/errorHandler.middleware.js";
import cors from "cors"
import rateLimit from "express-rate-limit"
import { paymentRouter } from "./routes/payment.route.js";

const app = express();
const port = PORT || 5000;

// connect with Database
connectDatabase(DB_URL);

app.use(cors({
    origin: FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
})
app.use(limiter)


// user routes
app.use("/api/user", authRouter)

app.use("/api/posts/", postRouter);
app.use("/api/subscription", paymentRouter)

app.get("/api/health", (_, res) => {
    res.send("Server is running healthy")
})

app.use(errorHandler)
// start server
app.listen(port, () => {
    console.log(`Server started at Port ${PORT}`)
})