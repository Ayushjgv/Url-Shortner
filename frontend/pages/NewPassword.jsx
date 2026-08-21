import React, { useState } from 'react';
import api from '../utils/axios';
import { useNavigate, useLocation } from 'react-router-dom';

const NewPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await api.post("/reset-password", {
                email,
                newPassword,
                confirmPassword,
            });
            setError("");
            setMessage(res.data?.message || "Password reset successfully!");
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            console.log(err);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center flex-col gap-2 p-4 m-5 w-full">
            <h2 className="text-xl font-bold">Set New Password</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 rounded-lg border w-full max-w-md mx-auto">
                <label className="text-sm font-medium">Resetting password for: <strong>{email || "User"}</strong></label>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="p-2 border rounded"
                    required
                />
                <button type="submit" className="cursor-pointer bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Update Password
                </button>
                {message && <div className="text-green-600 text-sm font-medium">{message}</div>}
                {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
            </form>
        </div>
    );
};

export default NewPassword;
