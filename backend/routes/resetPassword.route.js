import express from "express";
const router = express.Router();
import { findUserByEmail } from "../dao/user.dao.js";
import { hashPassword } from "../services/bcrypt.service.js";
import { updatePasswordDAO } from "../dao/user.dao.js";

router.post("/", async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "Email, new password, and confirmation are required" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const hashedPassword = await hashPassword(newPassword);
        const updatedUser = await updatePasswordDAO(email, hashedPassword);
        return res.status(200).json({ message: "Password reset successfully", user: updatedUser });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
});

export default router;