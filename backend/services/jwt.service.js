import jwt from "jsonwebtoken";

export const createTokenPayload = (user) => ({
    userId: user._id || user.userId,
    email: user.email,
    username: user.username,
});

export const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "10s",
    });
};

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_JWT_SECRET, {
        expiresIn: "7d",
    });
};
