import express from "express";
import { refreshTokenController } from "../controller/refreshToken.controller.js";
const router = express.Router();


router.post("/",refreshTokenController);

export default router;