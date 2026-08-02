import express from "express";
import { createShortUrl } from "../controller/shortUrl.controller.js";
import { verifyJWT } from "../middleware/verifyJwt.js";
const router = express.Router();

router.post("/",verifyJWT,createShortUrl);

export default router;
