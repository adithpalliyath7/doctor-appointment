import { Users, CalendarCheck, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const { appointments } = useAppointments();

    const doctorAppointments = appointments.filter(appt => appt.doctorId === user?.id);
    const pendingAppointments = doctorAppointments.filter(appt => appt.status === 'pending');
    const todayAppointments = doctorAppointments.filter(appt => appt.date === new Date().toISOString().split('T')[0]);

    const nextAppointment = doctorAppointments
        .filter(appt => appt.status === 'accepted')
        .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`))[0];

    const totalPatients = new Set(doctorAppointments.map(a => a.patientId)).size;
    const totalIncome = doctorAppointments
        .filter(appt => appt.status === 'completed')
        .reduce((acc, appt) => acc + (appt.fee || 0), 0);
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Doctor Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Users className="text-blue-600" />} title="Total Patients" value={totalPatients} sub="Unique patients" />
                <StatCard icon={<CalendarCheck className="text-emerald-600" />} title="Today's Appointments" value={todayAppointments.length} sub={`${pendingAppointments.length} Pending`} />
                <StatCard icon={<Clock className="text-amber-600" />} title="Next Appointment" value={nextAppointment ? nextAppointment.time : 'N/A'} sub={nextAppointment ? nextAppointment.patientName : 'No upcoming'} />
                <StatCard icon={<TrendingUp className="text-purple-600" />} title="Income" value={`₹${totalIncome}`} sub="Total completed" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Token */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Live Token Status</h2>
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="text-6xl font-black text-primary mb-2">08</div>
                        <p className="text-slate-500 font-medium">Current Token</p>
                        <div className="flex space-x-4 mt-8">
                            <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-medium">Previous</button>
                            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-lg shadow-primary/30">Next Token</button>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Upcoming Appointments</h2>
                    <div className="space-y-4">
                        {doctorAppointments.length > 0 ? (
                            [...doctorAppointments]
                                .sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`))
                                .slice(0, 5)
                                .map(appt => (
                                <div key={appt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold uppercase">
                                            {appt.patientName?.[0] || 'P'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{appt.patientName}</p>
                                            <p className="text-xs text-slate-500">{appt.date} • {appt.time}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${appt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            appt.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                                                appt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-red-100 text-red-700'
                                        }`}>
                                        {appt.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-400">No appointments yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, sub }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
            <div className="bg-slate-50 p-3 rounded-lg">
                {icon}
            </div>
        </div>
        <div>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-xs text-slate-400 mt-1">{sub}</p>
        </div>
    </div>
);

export default DoctorDashboard;
