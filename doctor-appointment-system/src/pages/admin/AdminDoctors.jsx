import { useState } from 'react';
import { Search, Plus, Trash2, Edit, X, Save } from 'lucide-react';
import { useAppointments } from '../../context/AppointmentContext';

const AdminDoctors = () => {
    const { doctors, addDoctor, updateDoctor, deleteDoctor } = useAppointments();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState(null);
    const [formData, setFormData] = useState({ name: '', specialization: '', hospital: '', fee: 500 });

    const filteredDoctors = doctors.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (doc = null) => {
        if (doc) {
            setEditingDoc(doc);
            setFormData({ name: doc.name, specialization: doc.specialization, hospital: doc.hospital, fee: doc.fee });
        } else {
            setEditingDoc(null);
            setFormData({ name: '', specialization: '', hospital: '', fee: 500 });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingDoc) {
            updateDoctor(editingDoc.id, formData);
        } else {
            addDoctor(formData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to remove this doctor?')) {
            deleteDoctor(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Manage Doctors</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center space-x-2 shadow-lg shadow-indigo-500/30"
                >
                    <Plus size={18} />
                    <span>Add Doctor</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center space-x-4">
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg flex items-center p-2">
                        <Search size={18} className="text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search doctors by name or specialty..."
                            className="bg-transparent outline-none w-full text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Specialization</th>
                            <th className="p-4">Hospital</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                        {filteredDoctors.map((doc) => (
                            <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-slate-700">{doc.name}</td>
                                <td className="p-4 text-slate-600">{doc.specialization}</td>
                                <td className="p-4 text-slate-600">{doc.hospital}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                        Active
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(doc)}
                                            className="p-1 hover:bg-slate-100 rounded text-slate-500"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(doc.id)}
                                            className="p-1 hover:bg-red-50 rounded text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredDoctors.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-400">No doctors found matching "{searchTerm}"</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">{editingDoc ? 'Edit Doctor' : 'Add New Doctor'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text" required
                                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                                <input
                                    type="text" required
                                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Hospital / Clinic</label>
                                <input
                                    type="text" required
                                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.hospital} onChange={e => setFormData({ ...formData, hospital: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Fee (₹)</label>
                                <input
                                    type="number" required
                                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.fee} onChange={e => setFormData({ ...formData, fee: Number(e.target.value) })}
                                />
                            </div>
                            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 mt-4">
                                <Save size={18} />
                                <span>{editingDoc ? 'Update Doctor' : 'Save Doctor'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDoctors;
