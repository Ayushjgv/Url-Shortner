import express from "express";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"
import cookieParser from "cookie-parser";

import shortUrlRoute from "./routes/shortUrl.route.js";
import userDashboardRoute from "./routes/dashboard.route.js"
import connectDB from "./configs/mongodb.config.js";
import urlschema from "./models/shorturl.model.js";
import { redirectFromShortUrl } from "./controller/shortUrl.controller.js";
import errorHandler from "./middleware/errorHandler.js";
import registerUser from "./routes/registerUser.route.js"
import loginUser from "./routes/loginUser.route.js";
import refreshToken from "./routes/refreshToken.route.js";
import verifyUser from "./routes/auth.route.js";
import getUserDetails from "./routes/getUserDetails.route.js";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(
  cors({
    origin: "http://localhost:5173", // React Vite
    credentials: true,
  })
);


app.use("/api/dashboard",userDashboardRoute);
app.use("/api/create",shortUrlRoute);
app.use("/api/register",registerUser);
app.use("/api/login",loginUser);
app.use("/api/refresh-token",refreshToken);
app.use("/api/verifyUser",verifyUser);
app.use("/api/getUserDetails",getUserDetails);

app.get("/:shortUrl",redirectFromShortUrl);


app.use(errorHandler);


app.listen(3000, () => {
  connectDB();
  console.log("Server is running on port http://localhost:3000");
}); 
