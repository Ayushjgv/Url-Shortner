import express from "express";
const router = express.Router();
import { verifyJWT } from "../middleware/verifyJwt.js";



router.get("/",verifyJWT,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"User is authenticated",
        user:req.user
    })
});

export default router;
