import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-[#F8F9FA] flex flex-col justify-center items-center p-4">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#49B3A3]/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#49B3A3]/10 backdrop-blur-xl rounded-2xl border border-[#49B3A3]/20 mb-4 shadow-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#49B3A3] to-[#3a8f82] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-[#49B3A3]/20">
                            M
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold text-[#49B3A3] tracking-tight mb-2">
                        Medi<span className="opacity-80">Connect</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Elevating Healthcare Experience</p>
                </div>

                <div className="animate-in fade-in zoom-in-95 duration-500 fill-mode-both">
                    <Outlet />
                </div>

                <p className="mt-12 text-center text-slate-400 text-sm">
                    &copy; 2025 MediConnect Digital Health. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default AuthLayout;
