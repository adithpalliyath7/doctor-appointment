import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, ArrowRight } from 'lucide-react';

const AppointmentSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 max-w-lg w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                        <div className="relative bg-primary text-white p-6 rounded-full shadow-lg shadow-primary/30">
                            <CheckCircle size={64} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Booking Confirmed!</h1>
                    <p className="text-slate-500 font-medium">Your appointment has been successfully scheduled. A confirmation email has been sent.</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100 flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm text-primary">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Appointment Status</p>
                        <p className="text-slate-800 font-bold">Successfully Scheduled</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate('/patient/appointments')}
                        className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-all flex items-center justify-center space-x-2 active:scale-95"
                    >
                        <span>View History</span>
                    </button>
                    <button
                        onClick={() => navigate('/patient/dashboard')}
                        className="p-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary/20 active:scale-95"
                    >
                        <span>Dashboard</span>
                        <ArrowRight size={18} />
                    </button>
                </div>

                <p className="text-xs text-slate-400 font-medium">Thank you for choosing MediConnect. Stay healthy!</p>
            </div>
        </div>
    );
};

export default AppointmentSuccess;
