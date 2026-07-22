import {
    createUser,
    findUserByEmail,
    findUserByUsername,
} from "../dao/user.dao.js";

import { hashPassword } from "../services/bcrypt.service.js";

export const registerUserController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        if (username.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Username must be at least 3 characters.",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters.",
            });
        }

        // Check username
        const usernameExists = await findUserByUsername(username);

        if (usernameExists) {
            return res.status(409).json({
                success: false,
                message: "Username already exists.",
            });
        }

        // Check email
        const emailExists = await findUserByEmail(email);

        if (emailExists) {
            return res.status(409).json({
                success: false,
                message: "Email already exists.",
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await createUser({
            username,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
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