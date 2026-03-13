import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/api';

const PatientRegister = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, phone, password, role: 'patient' }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.debugOTP) {
                    alert(`Development Mode: Your OTP is ${data.debugOTP}`);
                }
                setShowOTP(true);
                setIsLoading(false);
            } else {
                alert(data.message || 'Registration failed');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Server connection failed. Please ensure the backend is running.');
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data);
                window.open('/patient/dashboard', '_blank');
                setIsLoading(false);
            } else {
                alert(data.message || 'OTP Verification failed');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Verification error:', error);
            alert('Verification failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-200">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Join MediConnect</h2>
                        <p className="text-[#49B3A3] text-xs font-bold uppercase tracking-widest mt-1">Start Your Health Journey</p>
                    </div>
                    <button
                        onClick={() => window.open('/auth/login', '_blank')}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                </div>

                {!showOTP ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#49B3A3] transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#49B3A3]/50 focus:border-[#49B3A3]/50 focus:bg-white outline-none text-slate-800 transition-all placeholder:text-slate-400"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
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

                        {/* Phone Field */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Mobile Number</label>
                            <div className="flex relative group">
                                <div className="flex-none flex items-center justify-center pl-4 pr-3 py-3.5 bg-slate-100 border border-slate-200 border-r-0 rounded-l-2xl text-slate-600 font-bold">
                                    <Phone className="text-slate-400 mr-2" size={16} />
                                    <span>+91</span>
                                </div>
                                <input
                                    type="tel"
                                    required
                                    maxLength="10"
                                    pattern="[0-9]{10}"
                                    className="w-full pl-3 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-r-2xl focus:ring-2 focus:ring-[#49B3A3]/50 focus:border-[#49B3A3]/50 focus:bg-white outline-none text-slate-800 transition-all placeholder:text-slate-400"
                                    placeholder="00000 00000"
                                    value={phone}
                                    onChange={(e) => {
                                        // Only allow digits
                                        const val = e.target.value.replace(/\D/g, '');
                                        setPhone(val);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#49B3A3] transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#49B3A3]/50 focus:border-[#49B3A3]/50 focus:bg-white outline-none text-slate-800 transition-all placeholder:text-slate-400"
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#49B3A3] hover:bg-[#3a8f82] text-white py-4 rounded-2xl shadow-lg shadow-[#49B3A3]/20 transition-all font-bold text-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <span>Create Account</span>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div className="text-center space-y-2 mb-4">
                            <div className="mx-auto w-12 h-12 bg-[#49B3A3]/10 rounded-full flex items-center justify-center text-[#49B3A3] mb-4">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Verify Email</h3>
                            <p className="text-sm text-slate-500">We've sent a 6-digit code to <br /><span className="font-bold text-slate-700">{email}</span></p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">OTP Code</label>
                            <input
                                type="text"
                                required
                                maxLength="6"
                                className="w-full text-center text-3xl tracking-[1rem] pl-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#49B3A3]/50 focus:border-[#49B3A3]/50 focus:bg-white outline-none text-slate-800 transition-all placeholder:text-slate-300"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || otp.length < 6}
                            className="w-full bg-[#49B3A3] hover:bg-[#3a8f82] text-white py-4 rounded-2xl shadow-lg shadow-[#49B3A3]/20 transition-all font-bold text-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <span>Verify & Finish</span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowOTP(false)}
                            className="w-full py-2 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                        >
                            Change Email / Back
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-500 text-sm font-medium">
                        Already have an account? <span
                            onClick={() => window.open('/auth/login', '_blank')}
                            className="text-[#49B3A3] cursor-pointer hover:text-[#3a8f82] transition-colors font-bold underline decoration-2 underline-offset-4"
                        >Sign In</span>
                    </p>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center space-x-3 text-slate-400">
                <ShieldCheck size={18} className="text-emerald-500" />
                <p className="text-[10px] font-medium leading-tight">By clicking Create Account, you agree to our Terms of Service and Privacy Policy. Your data is encrypted.</p>
            </div>
        </div>
    );
};

export default PatientRegister;
