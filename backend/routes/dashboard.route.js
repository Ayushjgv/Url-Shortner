import express from "express";
import { verifyJWT } from "../middleware/verifyJwt.js";
const router = express.Router();

router.get("/",verifyJWT,(req,res)=>{
    res.json({
        success: true,
        user: req.user,
    });
});

export default router;