import jwt from "jsonwebtoken";
import { createTokenPayload, generateAccessToken } from "../services/jwt.service.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
};


export const refreshTokenController = (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
        const accessToken = generateAccessToken(createTokenPayload(decoded));

        return res.status(200)
            .cookie("accessToken", accessToken, {
                ...cookieOptions,
                maxAge: 10 * 1000,
            })
            .json({
                success: true,
            });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token",
        });
    }
};
