import express from "express";
const router = express.Router();
import { loginUserController } from "../controller/loginUser.controller.js";

router.post("/",loginUserController);

export default router;