import { Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';

const LiveToken = () => {
    const { user } = useAuth();
    const { appointments } = useAppointments();

    // Find the next upcoming appointment for this patient
    const nextAppt = appointments
        .filter(appt => appt.patientId === user?.id && ['pending', 'accepted'].includes(appt.status))
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    // Derived state for token
    const token = nextAppt ? {
        myToken: (parseInt(nextAppt.id.slice(-5)) % 50) + 1,
        currentToken: 8, // Mocked live current number
        estimatedTime: (Math.abs(parseInt(nextAppt.id.slice(-5)) % 50) + 1) * 5,
        doctor: nextAppt.doctorName,
        status: 'Waiting'
    } : null;

    const refreshStatus = () => {
        // Mock refresh interaction
        alert("Status updated! You are still 4 tokens away.");
    };

    return (
        <div className="max-w-md mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-800 text-center">Live Token Status</h1>

            <div className="bg-white rounded-2xl shadow-lg border border-primary/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary animate-pulse"></div>

                <div className="p-6 text-center border-b border-slate-100">
                    <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">Current Token Number</p>
                    <div className="text-6xl font-black text-primary my-4">
                        {token ? token.currentToken : '--'}
                    </div>
                    <p className="text-slate-600 font-medium">{token ? token.doctor : 'No Active Appointment'}</p>
                    <p className="text-xs text-slate-400">{token ? 'In Queue' : 'Book an appointment to see token'}</p>
                </div>

                <div className="p-6 bg-slate-50">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-600">Your Token</span>
                        <span className="bg-slate-800 text-white px-3 py-1 rounded-full font-bold text-sm">
                            {token ? `#${token.myToken}` : '--'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex items-center text-blue-700">
                            <Clock size={20} className="mr-2" />
                            <span className="font-semibold">Est. Wait Time</span>
                        </div>
                        <span className="font-bold text-blue-800 text-xl">
                            {token ? `${token.estimatedTime} min` : '--'}
                        </span>
                    </div>

                    <p className="text-center text-xs text-slate-400 mt-4">
                        Please arrive at the clinic 10 minutes before your estimated time.
                    </p>
                </div>
            </div>

            <button
                onClick={refreshStatus}
                className="w-full flex items-center justify-center space-x-2 bg-white border border-slate-200 p-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            >
                <RefreshCw size={18} />
                <span>Refresh Status</span>
            </button>
        </div>
    );
};

export default LiveToken;
