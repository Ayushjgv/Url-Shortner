import { findUserByEmail } from "../dao/user.dao.js";
import { generateOTP, storeOTP } from "../services/otp.service.js";
import { SendEmail } from "../services/email.service.js";

export const generateOTPController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            console.log("Email not provided");
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await findUserByEmail(email);
        if (!user) {
            console.log("User not found for email:", email);
            return res.status(404).json({ message: "User not found" });
        }
        console.log("Generating OTP for:", email);
        const otp = generateOTP();
        console.log("Storing OTP...");
        await storeOTP(email, otp);
        await SendEmail(email, otp);
        console.log("OTP sent successfully");
        return res.status(200).json({ message: "OTP Sent successfully" });
    } catch (error) {
        console.error("Error in generateOTPController:", error);
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
}