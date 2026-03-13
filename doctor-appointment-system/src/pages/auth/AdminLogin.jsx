import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, Lock, ArrowLeft, Loader2, ShieldAlert, ShieldCheck, ChevronRight, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/api';

const AdminLogin = () => {
    const [step, setStep] = useState(1); // 1: Credentials, 2: System Side
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [systemCode, setSystemCode] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const handleNextStep = (e) => {
        e.preventDefault();
        if (email && password) {
            setStep(2);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, systemCode }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.role !== 'admin') {
                    alert('Unauthorized access. This portal is for system administrators only.');
                    setIsLoading(false);
                    return;
                }
                login(data);
                window.open('/admin/dashboard', '_blank');
                setIsLoading(false);
            } else {
                alert(data.message || 'Authentication failed');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Server connection failed. Please ensure the backend is running.');
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-200">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 italic">Administrator</h2>
                        <p className="text-[#49B3A3] text-xs font-bold uppercase tracking-widest mt-1">System Override Access</p>
                    </div>
                    <button
                        onClick={() => step === 2 ? setStep(1) : navigate('/auth/login')}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center space-x-2 mb-8 px-1">
                    <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-[#49B3A3]' : 'bg-slate-100'}`}></div>
                    <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-[#49B3A3]' : 'bg-slate-100'}`}></div>
                </div>

                <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-6">
                    {step === 1 ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">System ID</label>
                                <div className="relative group">
                                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#49B3A3] transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#49B3A3]/50 focus:border-[#49B3A3]/50 focus:bg-white outline-none text-slate-800 transition-all placeholder:text-slate-400"
                                        placeholder="admin@admin.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Privileged Key</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#49B3A3] transition-colors" size={18} />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#49B3A3]/50 focus:border-[#49B3A3]/50 focus:bg-white outline-none text-slate-800 transition-all placeholder:text-slate-400"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/auth/forgot-password')}
                                        className="text-xs font-bold text-[#49B3A3] hover:text-[#3a8f82] transition-colors italic"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#49B3A3] hover:bg-[#3a8f82] text-white py-4 rounded-2xl shadow-lg shadow-[#49B3A3]/20 transition-all font-bold text-lg active:scale-[0.98] flex items-center justify-center space-x-2"
                            >
                                <span>Proceed to Security Layer</span>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 mb-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">Identity Loaded</p>
                                <p className="text-center text-slate-600 font-medium truncate italic">{email}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">System Authorization Code</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#49B3A3] transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#49B3A3]/50 focus:border-[#49B3A3]/50 focus:bg-white outline-none text-slate-800 transition-all placeholder:text-slate-400"
                                        placeholder="SYS-ADM-99"
                                        value={systemCode}
                                        onChange={(e) => setSystemCode(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#49B3A3] hover:bg-[#3a8f82] text-white py-4 rounded-2xl shadow-lg shadow-[#49B3A3]/20 transition-all font-bold text-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Establishing Tunnel...</span>
                                    </>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Cpu size={20} />
                                        <span>Authenticate System</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    )}
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center space-x-2 text-slate-500 text-xs">
                    <ShieldAlert size={14} className="text-amber-500" />
                    <span className="font-medium">All administrative actions are logged and audited</span>
                </div>
            </div>

            <p className="text-center text-slate-400 text-xs italic">
                Restrained Access Level 4. Unauthorized attempts will be reported.
            </p>
        </div>
    );
};

export default AdminLogin;
