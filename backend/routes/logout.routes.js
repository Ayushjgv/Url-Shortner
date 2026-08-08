import express from "express";
const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: "lax",
  path: "/",
};

router.post("/", (req, res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;