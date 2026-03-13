import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ShieldCheck, Lock, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../../utils/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password, 3: Success
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.debugOTP) {
                    alert(`Development Mode: Your Password Reset OTP is ${data.debugOTP}`);
                }
                setStep(2);
            } else {
                setError(data.message || 'Failed to send reset code');
            }
        } catch (err) {
            setError('Server connection failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setStep(3);
            } else {
                setError(data.message || 'Reset failed');
            }
        } catch (err) {
            setError('Server connection failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-200">
                <div className="mb-8 flex items-center">
                    <button
                        onClick={() => step === 1 ? window.open('/auth/login', '_blank') : setStep(1)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 mr-2"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                            {step === 3 ? 'Password Reset' : 'Recovery'}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">
                            {step === 1 && "Enter your email to receive a reset code"}
                            {step === 2 && "Enter the 6-digit code and your new password"}
                            {step === 3 && "Your password has been updated"}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium animate-in fade-in slide-in-from-top-4">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#49B3A3] transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#49B3A3]/50 focus:border-[#49B3A3]/50 focus:bg-white outline-none text-slate-800 transition-all placeholder:text-slate-400"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#49B3A3] hover:bg-[#3a8f82] text-white py-4 rounded-2xl shadow-lg shadow-[#49B3A3]/20 transition-all font-bold text-lg active:scale-[0.98] disabled:opacity-70 flex items-center justify-center space-x-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <span>Send Reset Code</span>}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Verification OTP</label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#49B3A3] transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    maxLength="6"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#49B3A3]/50 focus:border-[#49B3A3]/50 focus:bg-white outline-none text-slate-800 transition-all placeholder:text-slate-400 text-center tracking-[0.5rem] font-bold"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#49B3A3] transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    minLength="6"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#49B3A3]/50 focus:border-[#49B3A3]/50 focus:bg-white outline-none text-slate-800 transition-all placeholder:text-slate-400"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#49B3A3] hover:bg-[#3a8f82] text-white py-4 rounded-2xl shadow-lg shadow-[#49B3A3]/20 transition-all font-bold text-lg active:scale-[0.98] disabled:opacity-70 flex items-center justify-center space-x-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <span>Update Password</span>}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <div className="text-center py-4 space-y-6">
                        <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 animate-in zoom-in duration-500">
                            <CheckCircle2 size={48} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-800">Success!</h3>
                            <p className="text-slate-500 text-sm">Your password has been reset successfully. You can now log in with your new credentials.</p>
                        </div>
                        <button
                            onClick={() => window.open('/auth/login', '_blank')}
                            className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-2xl transition-all font-bold text-lg active:scale-[0.98]"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>

            {step === 1 && (
                <div className="text-center">
                    <p className="text-slate-500 text-sm font-medium">
                        Remembered your password?{' '}
                        <a href="/auth/login" target="_blank" className="text-[#49B3A3] font-bold hover:underline">
                            Login
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
