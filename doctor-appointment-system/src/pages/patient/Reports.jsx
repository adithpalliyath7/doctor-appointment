import { useState } from 'react';
import { FileText, Download, Eye, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';

const Reports = () => {
    const { user } = useAuth();
    const { appointments, reports } = useAppointments();
    const [searchTerm, setSearchTerm] = useState('');

    const patientAppointments = appointments.filter(appt => (appt.patient?._id || appt.patient || appt.patientId) === user?.id && appt.status === 'completed');

    // Combined Reports Data (Context reports + completed consultation summaries)
    const allReports = [
        ...patientAppointments.map(appt => ({
            id: `rep_${appt._id || appt.id}`,
            title: `Consultation Summary - ${appt.specialization}`,
            date: appt.date,
            doctor: appt.doctor?.name || appt.doctorName,
            type: 'Prescription'
        })),
        ...reports.map(rep => ({
            id: rep._id,
            title: rep.title,
            date: rep.date,
            doctor: rep.doctor,
            type: rep.type
        }))
    ];

    const filteredReports = allReports.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Medical Records</h1>
                <div className="bg-white border border-slate-200 rounded-lg flex items-center p-2 w-64 shadow-sm">
                    <Search size={18} className="text-slate-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search reports..."
                        className="bg-transparent outline-none w-full text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Report Name</th>
                            <th className="p-4 font-semibold text-slate-600">Date</th>
                            <th className="p-4 font-semibold text-slate-600 hidden md:table-cell">Doctor</th>
                            <th className="p-4 font-semibold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredReports.map((report) => (
                            <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">{report.title}</p>
                                            <p className="text-xs text-slate-500 md:hidden">{report.doctor}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-600">{report.date}</td>
                                <td className="p-4 text-slate-600 hidden md:table-cell">{report.doctor}</td>
                                <td className="p-4">
                                    <div className="flex space-x-2">
                                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View">
                                            <Eye size={18} />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Download">
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredReports.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-slate-400">
                                    <p>No medical records found.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reports;
