// src/pages/Register.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import api from "../utils/axios.js";

function Register() {
    const [UserName, setUserName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState("");
    const usenavigate = useNavigate();



    const RegisterUser = async(e) => {
        e.preventDefault();

        try {
            
            const res = await api.post("/register",{
                username:UserName,
                email:Email,
                password:Password
            });

            console.log(res);
            setErrorMessage("");
            usenavigate("/login");

        } catch (error) {
            setErrorMessage(error.message);
            console.log(error);
        }

    }



    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
            {/* //container */}
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                {/* Heading */}
                <h1 className="text-3xl font-bold text-center mb-2">
                    Create Account
                </h1>
                <p className="text-gray-500 text-center mb-8">
                    Register to continue
                </p>


                {/* //form */}
                <form className="space-y-5" 
                    onSubmit={(e)=>{RegisterUser(e);}}
                >
                    <div>
                        <label className="block mb-2 font-medium">Full Name</label>
                        <input
                            type="text"
                            value={UserName}
                            onChange={(e) => {
                                setUserName(e.target.value);
                            }}
                            placeholder="John Doe"
                            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Email</label>
                        <input
                            type="email"
                            value={Email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            placeholder="john@example.com"
                            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                            {/* //password field */}
                    <div>
                        <label className="block mb-2 font-medium">Password</label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={Password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                placeholder="********"
                                className="w-full border rounded-lg px-4 py-2 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600"
                            >
                                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                                {/* //submit button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Register
                    </button>
                </form>

                <div>
                    <p>{ErrorMessage}</p>
                </div>

                {/* //login */}
                <p className="text-center mt-6 text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;