import express from "express";
const router = express.Router();
import { findUserByEmail } from "../dao/user.dao.js";
import { hashPassword } from "../services/bcrypt.service.js";
import { updatePasswordDAO } from "../dao/user.dao.js";

router.post("/", async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            return res.status(401).json({ message: "Passwords do not match" });
        }
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const hashedPassword = await hashPassword(newPassword);
        const updatedUser = await updatePasswordDAO(email, hashedPassword);
        return res.status(200).json({ message: "Password reset successfully", user: updatedUser });
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
})

export default router;