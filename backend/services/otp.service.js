import { client } from "../configs/redis.config.js";

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

export const storeOTP = async (email, otp) => {
    await client.set(`otp:${email}`, String(otp), { EX: 300 });
}

export const verifyOTP = async (email, otp) => {
    const storedOTP = await client.get(`otp:${email}`);
    return storedOTP === String(otp);
}

export const deleteOTP = async (email) => {
    await client.del(`otp:${email}`);
}