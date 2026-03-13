import { useState } from 'react';
import { Search, Plus, Trash2, Edit, X, Save } from 'lucide-react';
import { useAppointments } from '../../context/AppointmentContext';

const AdminMedicines = () => {
    const { medicines, addMedicine, updateMedicine, deleteMedicine } = useAppointments();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMed, setEditingMed] = useState(null);
    const [formData, setFormData] = useState({ name: '', category: '', stock: 0, price: 0 });

    const filteredMedicines = medicines.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (med = null) => {
        if (med) {
            setEditingMed(med);
            setFormData({ name: med.name, category: med.category, stock: med.stock || 100, price: med.price });
        } else {
            setEditingMed(null);
            setFormData({ name: '', category: '', stock: 100, price: 0 });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingMed) {
            updateMedicine(editingMed._id || editingMed.id, formData);
        } else {
            addMedicine(formData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this medicine?')) {
            deleteMedicine(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Medicines Inventory</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center space-x-2 shadow-lg shadow-indigo-500/30"
                >
                    <Plus size={18} />
                    <span>Add Medicine</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center space-x-4">
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg flex items-center p-2">
                        <Search size={18} className="text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search inventory..."
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
                            <th className="p-4">Category</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Price</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                        {filteredMedicines.map((med) => (
                            <tr key={med._id || med.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-slate-700">{med.name}</td>
                                <td className="p-4 text-slate-600">{med.category}</td>
                                <td className="p-4 font-medium text-slate-800">{med.stock || 100} units</td>
                                <td className="p-4 text-slate-700">₹{med.price}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(med)}
                                            className="p-1 hover:bg-slate-100 rounded text-slate-500"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(med._id || med.id)}
                                            className="p-1 hover:bg-red-50 rounded text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">{editingMed ? 'Edit Medicine' : 'Add New Medicine'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Medicine Name</label>
                                <input
                                    type="text" required placeholder="e.g. Paracetamol"
                                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <input
                                    type="text" required placeholder="e.g. Fever"
                                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Stock Units</label>
                                    <input
                                        type="number" required
                                        className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                                    <input
                                        type="number" required
                                        className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 mt-4">
                                <Save size={18} />
                                <span>{editingMed ? 'Update Inventory' : 'Add to Inventory'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMedicines;
