import express from "express";
const router = express.Router();
import { verifyJWT } from "../middleware/verifyJwt.js";
import { getUserDetails } from "../controller/getUserDetails.controller.js";

router.get("/",verifyJWT,getUserDetails);

export default router;