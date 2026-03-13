import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Loader2, Award, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/api';

const DoctorLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.role !== 'doctor') {
                    alert('This portal is for medical practitioners only.');
                    setIsLoading(false);
                    return;
                }
                login(data);
                window.open('/doctor/dashboard', '_blank');
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
                        <h2 className="text-2xl font-black text-slate-800">Professional Portal</h2>
                        <p className="text-[#49B3A3] text-xs font-bold uppercase tracking-widest mt-1">Practitioner Access</p>
                    </div>
                    <button
                        onClick={() => navigate('/auth/login')}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Medical ID / Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#49B3A3] transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#49B3A3]/50 focus:border-[#49B3A3]/50 focus:bg-white outline-none text-slate-800 transition-all placeholder:text-slate-400"
                                    placeholder="doctor@hospital.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
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
                                    className="text-xs font-bold text-[#49B3A3] hover:text-[#3a8f82] transition-colors"
                                >
                                    Forgot Password?
                                </button>
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
                                <span>Access Practitioner Dashboard</span>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center space-x-2 text-slate-500 text-sm">
                    <Award size={16} className="text-[#49B3A3]" />
                    <span>Verified Practitioner Workspace</span>
                </div>
            </div>

            <div className="text-center">
                <p className="text-slate-400 text-xs px-8">
                    Contact hospital administration if you've lost access to your credentials or need to verify your account.
                </p>
            </div>
        </div>
    );
};

export default DoctorLogin;
