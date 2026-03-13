import { useState } from 'react';
import { Search, MapPin, Star, Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppointments } from '../../context/AppointmentContext';

const PatientDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { appointments, specializations, doctors } = useAppointments();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        navigate('/patient/appointments', { state: { search: searchTerm } });
    };

    const handleSpecClick = (specName) => {
        navigate('/patient/appointments', { state: { specialty: specName } });
    };

    const patientAppointments = appointments
        .filter(appt => (appt.patient?._id || appt.patient || appt.patientId) === user?.id)
        .sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`));

    const nextAppointment = [...patientAppointments]
        .filter(appt => appt.status !== 'completed' && appt.status !== 'rejected')
        .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`))[0];

    return (
        <div className="space-y-8">
            {/* Header / Welcome */}
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white shadow-lg shadow-primary/30">
                <h1 className="text-3xl font-bold mb-2">Hello, {user?.name || 'Patient'} 👋</h1>
                <p className="opacity-90 max-w-xl">Find the best doctors, book appointments, and get medical advice instantly.</p>

                <div className="mt-8 bg-white p-2 rounded-xl flex shadow-sm max-w-2xl">
                    <Search className="text-slate-400 m-3" />
                    <input
                        type="text"
                        placeholder="Search doctors, medicines, etc..."
                        className="flex-1 outline-none text-slate-700 bg-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Stats & Next Appointment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-slate-500 text-sm mb-1">Total Appointments</p>
                    <h3 className="text-2xl font-bold text-slate-800">{patientAppointments.length}</h3>
                </div>
                {nextAppointment ? (
                    <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-primary/10 shadow-md shadow-primary/5 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Next Appointment</p>
                                <h3 className="text-lg font-bold text-slate-800">{nextAppointment.doctor?.name || nextAppointment.doctorName}</h3>
                                <div className="flex items-center text-slate-500 text-sm mt-1">
                                    <Calendar size={14} className="mr-1" /> {nextAppointment.date}
                                    <Clock size={14} className="ml-3 mr-1" /> {nextAppointment.time}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/patient/live-token')}
                            className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-primary transition-colors"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm">
                        No upcoming appointments. Book your first one today!
                    </div>
                )}
            </div>

            {/* Recent Bookings */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Recent Bookings</h2>
                    <button
                        onClick={() => navigate('/patient/appointments')}
                        className="text-primary text-sm font-medium hover:underline"
                    >
                        View History
                    </button>
                </div>
                {patientAppointments.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
                        {patientAppointments.slice(0, 4).map((appt) => (
                            <div key={appt._id || appt.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{appt.doctor?.name || appt.doctorName}</h4>
                                        <p className="text-xs text-slate-500">{appt.date} • {appt.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${appt.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                        appt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            appt.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {appt.status}
                                    </span>
                                    <button
                                        onClick={() => appt.status === 'completed' ? navigate('/patient/reports') : navigate('/patient/live-token')}
                                        className="text-slate-400 hover:text-primary transition-colors"
                                    >
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
                        No recent bookings found.
                    </div>
                )}
            </section>

            {/* Specializations */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Specializations</h2>
                    <button
                        onClick={() => navigate('/patient/appointments')}
                        className="text-primary text-sm font-medium hover:underline"
                    >
                        View All
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {specializations.map((spec) => (
                        <div
                            key={spec.id}
                            onClick={() => handleSpecClick(spec.name)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            <div className="bg-primary/10 p-3 rounded-full text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="font-bold">{spec.name[0]}</span>
                            </div>
                            <span className="text-sm font-medium text-slate-700">{spec.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Top Doctors */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Top Doctors</h2>
                    <button
                        onClick={() => navigate('/patient/appointments')}
                        className="text-primary text-sm font-medium hover:underline"
                    >
                        View All
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                            <div className="h-48 overflow-hidden">
                                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{doctor.name}</h3>
                                        <p className="text-sm text-slate-500">{doctor.specialization}</p>
                                    </div>
                                    <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-1 rounded-md text-xs font-bold">
                                        <Star size={12} className="mr-1 fill-current" />
                                        {doctor.rating}
                                    </div>
                                </div>
                                <div className="flex items-center text-slate-400 text-sm mb-4">
                                    <MapPin size={14} className="mr-1" />
                                    {doctor.hospital}
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                                    <span className="font-bold text-primary">₹{doctor.fee}</span>
                                    <button
                                        onClick={() => navigate('/patient/appointments')}
                                        className="text-primary font-medium text-sm hover:underline flex items-center"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PatientDashboard;
