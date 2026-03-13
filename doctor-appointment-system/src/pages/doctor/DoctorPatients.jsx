import { useState } from 'react';
import { Search, FileText, Upload, Eye, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';

const DoctorPatients = () => {
    const { user } = useAuth();
    const { appointments } = useAppointments();
    const [searchTerm, setSearchTerm] = useState('');
    const [uploading, setUploading] = useState(null);

    // Get unique patients for this doctor
    const myPatients = appointments
        .filter(appt => appt.doctorId === user?.id)
        .reduce((acc, appt) => {
            if (!acc.find(p => p.id === appt.patientId)) {
                acc.push({
                    id: appt.patientId,
                    name: appt.patientName,
                    lastVisit: appt.date,
                    condition: appt.reason || 'General Checkup',
                    status: appt.status
                });
            }
            return acc;
        }, []);

    const filteredPatients = myPatients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUpload = (patientId) => {
        setUploading(patientId);
        setTimeout(() => {
            setUploading(null);
            alert('Medical report uploaded successfully!');
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">My Patients</h1>
                <div className="bg-white border border-slate-200 rounded-lg flex items-center p-2 shadow-sm">
                    <Search size={18} className="text-slate-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search your patients..."
                        className="bg-transparent outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Patient Name</th>
                            <th className="p-4 font-semibold text-slate-600">Last Visit</th>
                            <th className="p-4 font-semibold text-slate-600">Last Condition</th>
                            <th className="p-4 font-semibold text-slate-600">Status</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredPatients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-medium text-slate-800">{patient.name}</td>
                                <td className="p-4 text-slate-600">{patient.lastVisit}</td>
                                <td className="p-4 text-slate-600">{patient.condition}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${patient.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {patient.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex space-x-3 justify-end">
                                        <button
                                            onClick={() => handleUpload(patient.id)}
                                            disabled={uploading === patient.id}
                                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium disabled:text-slate-400"
                                        >
                                            {uploading === patient.id ? <Check size={16} /> : <Upload size={16} />}
                                            <span>{uploading === patient.id ? 'Uploaded' : 'Upload Report'}</span>
                                        </button>
                                        <button className="flex items-center space-x-1 text-slate-500 hover:text-slate-700 text-sm font-medium">
                                            <Eye size={16} />
                                            <span>View Records</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredPatients.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-400">
                                    <p>No patients found. Only patients who have booked appointments with you will appear here.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DoctorPatients;
