import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, ShieldCheck } from 'lucide-react';

const LoginSelection = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full space-y-4">
            <p className="text-[#49B3A3] text-sm font-bold uppercase tracking-widest text-center mb-8">Access Portal</p>

            <div className="grid grid-cols-1 gap-4">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
                    <RoleCard
                        icon={<User size={28} />}
                        title="Patient"
                        desc="Medical dashboard & pharmacy"
                        onClick={() => window.open('/auth/login/patient', '_blank')}
                        themeColor="teal"
                        gradient="from-[#49B3A3]/10 to-emerald-500/10"
                    />
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
                    <RoleCard
                        icon={<Stethoscope size={28} />}
                        title="Doctor"
                        desc="Manage schedule & patients"
                        onClick={() => window.open('/auth/login/doctor', '_blank')}
                        themeColor="blue"
                        gradient="from-blue-500/10 to-indigo-500/10"
                    />
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-450 fill-mode-both">
                    <RoleCard
                        icon={<ShieldCheck size={28} />}
                        title="Admin"
                        desc="System metrics & control"
                        onClick={() => window.open('/auth/login/admin', '_blank')}
                        themeColor="indigo"
                        gradient="from-indigo-500/10 to-purple-500/10"
                    />
                </div>
            </div>
        </div>
    );
};

const RoleCard = ({ icon, title, desc, onClick, themeColor, gradient }) => {
    const themes = {
        teal: "text-[#49B3A3] border-slate-200 hover:border-[#49B3A3]/50 hover:bg-[#49B3A3]/5 shadow-sm hover:shadow-md",
        blue: "text-blue-600 border-slate-200 hover:border-blue-400/50 hover:bg-blue-50 shadow-sm hover:shadow-md",
        indigo: "text-indigo-600 border-slate-200 hover:border-indigo-400/50 hover:bg-indigo-50 shadow-sm hover:shadow-md"
    };

    return (
        <button
            onClick={onClick}
            className={`group relative flex items-center p-5 rounded-2xl border bg-white transition-all duration-300 text-left w-full overflow-hidden ${themes[themeColor]}`}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

            <div className={`relative z-10 mr-5 p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-110 group-hover:bg-white transition-all duration-300`}>
                {icon}
            </div>

            <div className="relative z-10 flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-0.5 group-hover:translate-x-1 transition-transform">{title}</h3>
                <p className="text-slate-500 text-sm font-medium">{desc}</p>
            </div>

            <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </button>
    );
};

export default LoginSelection;
