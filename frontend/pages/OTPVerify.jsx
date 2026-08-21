import React, { useState } from 'react';
import api from '../utils/axios';
import { useNavigate, useLocation } from 'react-router-dom';

const OTPVerify = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || props.email || "";

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/otp-verify", { email, otp });
            setError("");
            navigate("/new-password", { state: { email } });
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            console.log(err);
        }
    }

    return (
        <div className="h-screen flex items-center justify-center flex-col gap-2 p-4 m-5 w-full">
            <h2 className="text-xl font-bold">Verify OTP</h2>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 p-4 rounded-lg border w-full max-w-md mx-auto'>
                <label>OTP sent to: <strong>{email || "your email"}</strong></label>
                <input 
                    type="text" 
                    name="otp" 
                    placeholder="Enter 6-digit OTP"
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    className="p-2 border rounded"
                    required
                />
                <button type="submit" className='cursor-pointer bg-blue-500 text-white p-2 rounded hover:bg-blue-600'>
                    Verify OTP
                </button>
                {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
            </form>
        </div>
    )
}

export default OTPVerify;