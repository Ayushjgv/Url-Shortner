import { useState } from "react";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";


const ResetPassword = () => {
    const [Error, setError] = useState("");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/reset-password", formData);
            console.log(res.data);
            setError("");
            navigate("/login")
        } catch (error) {
            setError(error.message);
            console.log(error);
        }
    }

    return (
        <div className="h-screen flex items-center justify-center gap-2 p-4 m-5 w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 rounded-lg border ">
                <label>Email</label>
                <input type="email" name="email" placeholder="Enter your email" required value={formData.email} onChange={handleChange} />
                <label>New Password</label>
                <input type="password" name="newPassword" placeholder="Enter your new password" required value={formData.newPassword} onChange={handleChange} />
                <label>Confirm New Password</label>
                <input type="password" name="confirmPassword" placeholder="Enter your confirm password" required value={formData.confirmPassword} onChange={handleChange} />
                <button type="submit">Reset Password</button>
                {Error && <div className="text-red-800">{Error}</div>}
            </form>
        </div>
    )
}

export default ResetPassword