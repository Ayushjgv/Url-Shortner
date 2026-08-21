import { useState } from "react";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";


const ResetPassword = () => {
    const [Error, setError] = useState("");
    const navigate = useNavigate();
    const [email, setemail] = useState("");

    const handleChange = (e) => {
        setemail((prev) => (e.target.value));
        console.log(email);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/otp-generate", { email });
            setError("");
            navigate("/otp-verify", { state: { email } });
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            console.log(error);
        }
    }

    return (
        <div className="h-screen flex items-center justify-center gap-2 p-4 m-5 w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 rounded-lg border ">
                <label>Email</label>
                <input type="email" name="email" placeholder="Enter your email" required value={email} onChange={handleChange} />
                <button type="submit">Reset Password</button>
                {Error && <div className="text-red-800">{Error}</div>}
            </form>
        </div>
    )
}

export default ResetPassword