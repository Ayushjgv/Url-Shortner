import User from "../models/user.model.js";

export const findUserByEmail = async (email) => {
    return await User.findOne({ email }).select("+password");
};

export const findUserByUsername = async (username) => {
    return await User.findOne({ username });
};

export const findUserById = async (userId) => {
    return await User.findById(userId).select("-password");
};

export const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};
