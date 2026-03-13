import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Star, X, Calendar, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppointments } from '../../context/AppointmentContext';
import { useAuth } from '../../context/AuthContext';

const DoctorSearch = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { doctors, specializations, bookAppointment } = useAppointments();
    const { user } = useAuth();


    const [searchTerm, setSearchTerm] = useState(location.state?.search || '');
    const [selectedSpec, setSelectedSpec] = useState(location.state?.specialty || 'All');

    // Map of Display Category -> Doctor Specialization keyword
    const specMap = {
        'Cardiology': 'Cardiologist',
        'Neurology': 'Neurologist',
        'Orthopedics': 'Orthopedic',
        'Pediatrics': 'Pediatrician',
        'Dentist': 'Dentist',
        'Eye Care': 'Opthalmologist',
        'Dermatology': 'Dermatologist',
        'General': 'General'
    };

    // If we want to handle incoming state changes while the component is mounted
    useEffect(() => {
        if (location.state?.specialty) {
            setSelectedSpec(location.state.specialty);
        }
        if (location.state?.search) {
            setSearchTerm(location.state.search);
        }
    }, [location.state?.specialty, location.state?.search]);

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');

    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch =
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());

        const targetSpec = specMap[selectedSpec] || selectedSpec;
        const matchesSpec = selectedSpec === 'All' ||
            doc.specialization.includes(targetSpec) ||
            doc.specialization === selectedSpec;

        return matchesSearch && matchesSpec;
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Find a Doctor</h1>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 sticky top-20 z-40">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by doctor name or hospital..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
                    <Filter size={20} className="text-slate-400 min-w-[20px]" />
                    <button
                        onClick={() => setSelectedSpec('All')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedSpec === 'All' ? 'bg-primary text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                        All
                    </button>
                    {specializations.map(spec => (
                        <button
                            key={spec.id}
                            onClick={() => setSelectedSpec(spec.name)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedSpec === spec.name ? 'bg-primary text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                        >
                            {spec.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map(doctor => (
                    <div key={doctor._id || doctor.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                        <div className="p-5 flex-1">
                            <div className="flex justify-between items-start">
                                <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                                <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-1 rounded-md text-xs font-bold">
                                    <Star size={12} className="mr-1 fill-current" />
                                    {doctor.rating}
                                </div>
                            </div>
                            <div className="mt-3">
                                <h3 className="font-bold text-lg text-slate-800">{doctor.name}</h3>
                                <p className="text-primary font-medium text-sm">{doctor.specialization}</p>
                                <p className="text-slate-500 text-xs mt-1">{doctor.experience} experience</p>
                            </div>
                            <div className="mt-4 flex items-center text-slate-500 text-sm">
                                <MapPin size={14} className="mr-1 shrink-0" />
                                <span className="truncate">{doctor.hospital}</span>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-50 bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-slate-400">Consultation Fee</p>
                                <p className="text-lg font-bold text-primary">₹{doctor.fee}</p>
                            </div>
                            <button
                                onClick={() => setSelectedDoctor(doctor)}
                                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Book Appointment
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Booking Modal */}
            {selectedDoctor && (
                <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800">Book Appointment</h2>
                            <button onClick={() => setSelectedDoctor(null)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center space-x-4 mb-6">
                                <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-16 h-16 rounded-full object-cover" />
                                <div>
                                    <h3 className="font-bold text-slate-800">{selectedDoctor.name}</h3>
                                    <p className="text-sm text-primary">{selectedDoctor.specialization}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center">
                                    <Calendar size={16} className="mr-2" /> Select Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center">
                                    <Clock size={16} className="mr-2" /> Select Time Slot
                                </label>
                                <select
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                    value={bookingTime}
                                    onChange={(e) => setBookingTime(e.target.value)}
                                >
                                    <option value="">Choose a time</option>
                                    <option value="09:00 AM">09:00 AM</option>
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="11:00 AM">11:00 AM</option>
                                    <option value="02:00 PM">02:00 PM</option>
                                    <option value="03:00 PM">03:00 PM</option>
                                    <option value="04:00 PM">04:00 PM</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 flex gap-3">
                            <button
                                onClick={() => setSelectedDoctor(null)}
                                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (!bookingDate || !bookingTime) {
                                        alert('Please select date and time');
                                        return;
                                    }
                                    const res = await bookAppointment({
                                        doctorId: selectedDoctor.id,
                                        doctorName: selectedDoctor.name,
                                        doctorImage: selectedDoctor.image,
                                        specialization: selectedDoctor.specialization,
                                        patientId: user?._id || user?.id,
                                        patientName: user?.name,
                                        date: bookingDate,
                                        time: bookingTime,
                                        fee: selectedDoctor.fee
                                    });
                                    if (res) {
                                        navigate('/patient/appointment-success');
                                    } else {
                                        alert('Booking failed. Please try again.');
                                    }
                                }}

                                className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark shadow-lg shadow-primary/20 transition-colors"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {filteredDoctors.length === 0 && (
                <div className="text-center py-20 text-slate-400">
                    <p>No doctors found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default DoctorSearch;
