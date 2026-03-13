import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Search } from 'lucide-react';
import { medicines } from '../../utils/mockData';
import { useAppointments } from '../../context/AppointmentContext';

const Medicines = () => {
    const navigate = useNavigate();
    const { cart, addToCart, clearCart } = useAppointments();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMedicines = medicines.filter(med =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Global functions from useAppointments are used instead

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    return (
        <div className="h-[calc(100vh-theme(spacing.24))] flex flex-col md:flex-row gap-6">
            {/* Shop Section */}
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Pharmacy</h1>
                    <div className="bg-white border border-slate-200 rounded-lg flex items-center p-2 w-64 shadow-sm">
                        <Search size={18} className="text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search medicines..."
                            className="bg-transparent outline-none w-full text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMedicines.map(med => (
                        <div key={med._id || med.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 transition-all hover:shadow-md">
                            <div className="h-32 bg-slate-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                <img src={med.image} alt={med.name} className="h-full w-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{med.name}</h3>
                                <p className="text-xs text-slate-500 mb-3">{med.category}</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-primary">₹{med.price}</span>
                                    <button
                                        onClick={() => addToCart(med)}
                                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-lg transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredMedicines.length === 0 && (
                        <div className="col-span-full text-center py-20 text-slate-400">
                            <p>No medicines found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cart Section */}
            <div className="w-full md:w-80 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
                <div className="flex items-center space-x-2 mb-6">
                    <ShoppingCart className="text-primary" />
                    <h2 className="font-bold text-lg">Your Cart</h2>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-slate-400 py-10">
                            <p>Your cart is empty.</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item._id || item.id} className="flex justify-between items-center border-b border-slate-50 pb-2">
                                <div>
                                    <p className="font-medium text-sm text-slate-800">{item.name}</p>
                                    <p className="text-xs text-slate-500">₹{item.price} x {item.qty}</p>
                                </div>
                                <span className="font-bold text-slate-700">₹{item.price * item.qty}</span>
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4 space-y-4">
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{cartTotal}</span>
                    </div>
                    <button
                        onClick={() => {
                            if (cart.length === 0) return;
                            clearCart();
                            navigate('/patient/medicine-success');
                        }}
                        className="w-full bg-primary text-white py-3 rounded-xl font-medium shadow-lg shadow-primary/30 hover:bg-primary-dark transition-colors"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Medicines;
