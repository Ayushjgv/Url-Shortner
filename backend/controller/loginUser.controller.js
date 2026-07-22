// controllers/loginUser.controller.js

import { findUserByEmail } from "../dao/user.dao.js";
import { comparePassword } from "../services/bcrypt.service.js";
import { generateAccessToken } from "../services/jwt.service.js";

export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        // Find user
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
        // Compare password
        const isPasswordCorrect = await comparePassword(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Generate JWT
        const token = generateAccessToken({
            userId: user._id,
            email: user.email,
            username: user.username
        });

        // Send response
        return res.status(200)
            .cookie(
                "accessToken",
                token,
                {
                    httpOnly: true,
                    secure:false,
                    sameSite: "lax",
                    maxAge: 15 * 60 * 1000,
                }
            )
            .json({
                success: true,
                message: "Login successful.",
                token:token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
            });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};