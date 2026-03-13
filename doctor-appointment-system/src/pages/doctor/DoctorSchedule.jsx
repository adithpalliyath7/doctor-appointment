import { useState, useEffect } from 'react';
import { Clock, Check } from 'lucide-react';
import { useAppointments } from '../../context/AppointmentContext';
import { useAuth } from '../../context/AuthContext';

const DoctorSchedule = () => {
    const { user } = useAuth();
    const { availability, updateAvailability } = useAppointments();

    const [days, setDays] = useState(() => {
        // Functional initializer to load initial state from availability if it exists
        const initialDays = [
            { day: 'Monday', active: true, start: '09:00', end: '17:00' },
            { day: 'Tuesday', active: true, start: '09:00', end: '17:00' },
            { day: 'Wednesday', active: true, start: '09:00', end: '17:00' },
            { day: 'Thursday', active: true, start: '09:00', end: '17:00' },
            { day: 'Friday', active: true, start: '09:00', end: '13:00' },
            { day: 'Saturday', active: false, start: '10:00', end: '14:00' },
            { day: 'Sunday', active: false, start: '00:00', end: '00:00' },
        ];

        // This is tricky because `user.id` might not be available yet. 
        // We'll keep the useEffect for when user changes, but we'll try to find it now if possible.
        return initialDays;
    });

    useEffect(() => {
        if (user?.id && availability[user.id]) {
            setDays(availability[user.id]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]); // Only change if user changes

    const handleSave = () => {
        updateAvailability(user.id, days);
        alert('Schedule saved successfully!');
    };

    const toggleDay = (index) => {
        const newDays = [...days];
        newDays[index].active = !newDays[index].active;
        setDays(newDays);
    };

    const updateTime = (index, field, value) => {
        const newDays = [...days];
        newDays[index][field] = value;
        setDays(newDays);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Availability Settings</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
                {days.map((item, index) => (
                    <div key={item.day} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                        <div className="flex items-center space-x-4">
                            <input
                                type="checkbox"
                                checked={item.active}
                                onChange={() => toggleDay(index)}
                                className="w-5 h-5 rounded text-primary focus:ring-primary"
                            />
                            <span className={`font-medium ${item.active ? 'text-slate-800' : 'text-slate-400'}`}>{item.day}</span>
                        </div>

                        {item.active ? (
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                                    <Clock size={16} className="text-slate-400" />
                                    <input
                                        type="time"
                                        value={item.start}
                                        onChange={(e) => updateTime(index, 'start', e.target.value)}
                                        className="bg-transparent outline-none text-sm text-slate-700"
                                    />
                                </div>
                                <span className="text-slate-400">-</span>
                                <div className="flex items-center space-x-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                                    <Clock size={16} className="text-slate-400" />
                                    <input
                                        type="time"
                                        value={item.end}
                                        onChange={(e) => updateTime(index, 'end', e.target.value)}
                                        className="bg-transparent outline-none text-sm text-slate-700"
                                    />
                                </div>
                            </div>
                        ) : (
                            <span className="text-sm text-slate-400 italic">Unavailable</span>
                        )}
                    </div>
                ))}

                <button
                    onClick={handleSave}
                    className="w-full bg-primary text-white py-3 rounded-xl font-medium shadow-lg shadow-primary/30 hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2"
                >
                    <Check size={20} />
                    <span>Save Schedule</span>
                </button>
            </div>
        </div>
    );
};

export default DoctorSchedule;
