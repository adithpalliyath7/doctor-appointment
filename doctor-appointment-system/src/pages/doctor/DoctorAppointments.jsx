import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';

const DoctorAppointments = () => {
    const { user } = useAuth();
    const { appointments, updateAppointmentStatus } = useAppointments();

    const doctorAppointments = appointments
        .filter(appt => (appt.doctor?._id || appt.doctor || appt.doctorId) === user?.id)
        .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Appointments Today</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Date</th>
                            <th className="p-4 font-semibold text-slate-600">Time</th>
                            <th className="p-4 font-semibold text-slate-600">Patient</th>
                            <th className="p-4 font-semibold text-slate-600">Status</th>
                            <th className="p-4 font-semibold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {doctorAppointments.length > 0 ? (
                            doctorAppointments.map((appt) => (
                                <tr key={appt._id || appt.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-slate-600">
                                        <div className="flex items-center">
                                            <Calendar size={14} className="mr-2 text-slate-400" />
                                            {appt.date}
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-slate-700">{appt.time}</td>
                                    <td className="p-4 font-medium text-slate-800">{appt.patient?.name || appt.patientName}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                                            ${appt.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                appt.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                                    appt.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-amber-100 text-amber-700'}`}>
                                            {appt.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            {appt.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => updateAppointmentStatus(appt._id || appt.id, 'accepted')}
                                                        className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                                                        title="Accept"
                                                    >
                                                        <Clock size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => updateAppointmentStatus(appt._id || appt.id, 'rejected')}
                                                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            )}
                                            {appt.status === 'accepted' && (
                                                <button
                                                    onClick={() => updateAppointmentStatus(appt._id || appt.id, 'completed')}
                                                    className="text-green-600 hover:bg-green-50 p-1 rounded"
                                                    title="Mark Completed"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-400">No appointments found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DoctorAppointments;
