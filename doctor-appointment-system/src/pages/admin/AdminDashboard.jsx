import { Users, Stethoscope, IndianRupee, Activity, TrendingUp } from 'lucide-react';
import { useAppointments } from '../../context/AppointmentContext';

const AdminDashboard = () => {
    const { appointments, doctors } = useAppointments();

    const totalPatients = new Set(appointments.map(a => a.patient?._id || a.patient || a.patientId)).size;
    const totalAppointments = appointments.length;
    const activeDoctors = doctors.length;
    const totalRevenue = appointments
        .filter(a => a.status === 'completed')
        .reduce((acc, a) => acc + (a.fee || 0), 0);

    const recentAppointments = [...appointments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Admin Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Users className="text-blue-500" />}
                    title="Total Patients"
                    value={totalPatients}
                    trend="+100% (New)"
                    color="bg-blue-500"
                />
                <StatCard
                    icon={<Stethoscope className="text-emerald-500" />}
                    title="Active Doctors"
                    value={activeDoctors}
                    trend="From directory"
                    color="bg-emerald-500"
                />
                <StatCard
                    icon={<IndianRupee className="text-amber-500" />}
                    title="Revenue"
                    value={`₹${totalRevenue}`}
                    trend="From completed appts"
                    color="bg-amber-500"
                />
                <StatCard
                    icon={<Activity className="text-purple-500" />}
                    title="Appointments"
                    value={totalAppointments}
                    trend="Total booked"
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Registrations */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Bookings</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-medium">
                            <thead className="text-slate-400 text-xs uppercase bg-slate-50">
                                <tr>
                                    <th className="p-3 rounded-l-lg">Patient</th>
                                    <th className="p-3">Doctor</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3 rounded-r-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentAppointments.length > 0 ? (
                                    recentAppointments.map(appt => (
                                        <tr key={appt._id || appt.id}>
                                            <td className="p-3 flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                                                    {(appt.patient?.name || appt.patientName || 'P')[0]}
                                                </div>
                                                <span>{appt.patient?.name || appt.patientName}</span>
                                            </td>
                                            <td className="p-3 text-slate-500">{appt.doctor?.name || appt.doctorName}</td>
                                            <td className="p-3 text-slate-500">{appt.date}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${appt.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    appt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        appt.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {appt.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-400">No recent bookings.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Stats */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
                    <h2 className="text-lg font-bold text-slate-800">Platform Growth</h2>
                    <div className="h-48 flex items-end justify-between space-x-2 px-2">
                        {[40, 60, 45, 70, 50, 80, 75].map((h, i) => (
                            <div key={i} className="w-full bg-indigo-100 rounded-t-lg relative group">
                                <div
                                    style={{ height: `${h}%` }}
                                    className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-lg transition-all group-hover:bg-indigo-600"
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, trend, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 opacity-5 rounded-full -mr-4 -mt-4 ${color}`}></div>
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-green-50 text-green-600 flex items-center`}>
                <TrendingUp size={12} className="mr-1" /> 8%
            </span>
        </div>
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
        <p className="text-slate-400 text-xs mt-2">{trend}</p>
    </div>
);

export default AdminDashboard;
