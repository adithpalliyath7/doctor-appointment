import { useNavigate } from 'react-router-dom';
import { Package, CheckCircle, Truck, ArrowRight } from 'lucide-react';

const MedicineSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 max-w-lg w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                        <div className="relative bg-blue-500 text-white p-6 rounded-full shadow-lg shadow-blue-500/30">
                            <Package size={64} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight text-blue-500">Order Placed!</h1>
                    <p className="text-slate-500 font-medium">Your medicine order has been placed successfully. You can track your delivery in the dashboard.</p>
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white p-3 rounded-xl shadow-sm text-blue-500">
                            <Truck size={24} />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Delivery Status</p>
                            <p className="text-slate-800 font-bold">In Preparation</p>
                        </div>
                    </div>
                    <div className="flex items-center text-emerald-500 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full">
                        <CheckCircle size={14} className="mr-1" />
                        <span>Paid</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <button
                        onClick={() => navigate('/patient/dashboard')}
                        className="p-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 active:scale-95 w-full"
                    >
                        <span>Back to Home</span>
                        <ArrowRight size={18} />
                    </button>
                </div>

                <p className="text-xs text-slate-400 font-medium">Usually delivers within 45-60 minutes in your area.</p>
            </div>
        </div>
    );
};

export default MedicineSuccess;
