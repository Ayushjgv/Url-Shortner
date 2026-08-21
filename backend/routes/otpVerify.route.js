import express from "express";
const router = express.Router();
import { verifyOTP } from "../services/otp.service.js";


router.post("/", async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log("Verifying OTP for:", email, "OTP:", otp);
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }
        const isVerified = await verifyOTP(email, otp);
        if (!isVerified) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error in OTP verification:", error);
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
});

export default router;