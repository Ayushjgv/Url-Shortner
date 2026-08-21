import React, { useState } from 'react';
import api from '../utils/axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowLeft, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

const OTPVerify = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || props.email || "";

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [infoMessage, setInfoMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setInfoMessage("");

        try {
            await api.post("/otp-verify", { email, otp });
            navigate("/new-password", { state: { email } });
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Invalid or expired OTP");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!email) {
            setError("Email address is missing. Please restart the process.");
            return;
        }
        setResending(true);
        setError("");
        setInfoMessage("");

        try {
            await api.post("/otp-generate", { email });
            setInfoMessage("A new OTP code has been sent to your email.");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to resend OTP");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 px-4 py-12 relative overflow-hidden">
            {/* Ambient background glow elements */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 relative z-10">
                {/* Header Badge */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                        <ShieldCheck className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Verify Security Code</h1>
                    <p className="text-slate-400 text-sm mt-1 text-center">
                        We sent a 6-digit verification code to
                    </p>
                    <span className="mt-1 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-300 font-medium text-xs">
                        {email || "your email"}
                    </span>
                </div>

                {/* Info / Error Alerts */}
                {infoMessage && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm text-center">
                        {infoMessage}
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 text-center">
                            Enter 6-Digit OTP
                        </label>
                        <input
                            type="text"
                            name="otp"
                            maxLength={6}
                            placeholder="• • • • • •"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full text-center text-2xl font-bold tracking-[0.5em] py-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                Verify Code
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Resend Option */}
                <div className="mt-6 flex flex-col items-center gap-4">
                    <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resending}
                        className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                        Didn't receive code? Resend OTP
                    </button>

                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors font-medium mt-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OTPVerify;