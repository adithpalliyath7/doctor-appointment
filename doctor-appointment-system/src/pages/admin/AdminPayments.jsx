import { Search, Download, CheckCircle, Clock } from 'lucide-react';
import { useAppointments } from '../../context/AppointmentContext';
import { useState } from 'react';

const AdminPayments = () => {
    const { transactions } = useAppointments();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTransactions = transactions.filter(t =>
        t.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDownload = (id) => {
        alert(`Generating invoice for ${id}...`);
        // Simulated download
        const data = "Invoice Data";
        const blob = new Blob([data], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${id}.txt`;
        a.click();
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Payments & Transactions</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center space-x-4">
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg flex items-center p-2">
                        <Search size={18} className="text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search by ID or Patient Name..."
                            className="bg-transparent outline-none w-full text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase">
                        <tr>
                            <th className="p-4">Transaction ID</th>
                            <th className="p-4">User</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Invoice</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                        {filteredTransactions.map((pay) => (
                            <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-mono text-xs text-slate-500">{pay.id}</td>
                                <td className="p-4 font-medium text-slate-800">{pay.user}</td>
                                <td className="p-4 font-bold text-slate-700">₹{pay.amount}</td>
                                <td className="p-4 text-slate-600">{pay.date}</td>
                                <td className="p-4">
                                    <span className="flex items-center space-x-1 text-xs font-bold text-green-600">
                                        <CheckCircle size={14} />
                                        <span>Success</span>
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleDownload(pay.id)}
                                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center justify-end space-x-1 w-full"
                                    >
                                        <Download size={16} />
                                        <span>Download</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPayments;
