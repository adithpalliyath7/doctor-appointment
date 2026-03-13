import { Search, MoreHorizontal, Eye, Ban } from 'lucide-react';

const AdminPatients = () => {
    // Mock Data
    const patients = [
        { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '+91 98765 43210', registered: '2025-10-01', status: 'Active' },
        { id: 2, name: 'Bob Williams', email: 'bob@example.com', phone: '+91 98765 43211', registered: '2025-09-15', status: 'Active' },
        { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: '+91 98765 43212', registered: '2025-08-20', status: 'Blocked' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Manage Patients</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center space-x-4">
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg flex items-center p-2">
                        <Search size={18} className="text-slate-400 mr-2" />
                        <input type="text" placeholder="Search patients..." className="bg-transparent outline-none w-full text-sm" />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Contact</th>
                            <th className="p-4">Registered</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                        {patients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <p className="font-bold text-slate-700">{patient.name}</p>
                                    <p className="text-xs text-slate-400">{patient.email}</p>
                                </td>
                                <td className="p-4 text-slate-600">{patient.phone}</td>
                                <td className="p-4 text-slate-600">{patient.registered}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                        ${patient.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {patient.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><Eye size={16} /></button>
                                        <button className="p-1 hover:bg-red-50 rounded text-red-500"><Ban size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPatients;
