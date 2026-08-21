import express from "express";
const router = express.Router();
import { generateOTPController } from "../controller/otpGenerator.controller.js";


router.post("/", generateOTPController);

export default router;