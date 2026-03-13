import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../utils/api';
import { doctors as initialDoctors, medicines as initialMedicines, specializations } from '../utils/mockData';
import { useAuth } from './AuthContext';

const AppointmentContext = createContext();

export const useAppointments = () => {
    const context = useContext(AppointmentContext);
    if (!context) {
        throw new Error('useAppointments must be used within an AppointmentProvider');
    }
    return context;
};

export const AppointmentProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [cart, setCart] = useState([]);
    const [ambulanceRequests, setAmbulanceRequests] = useState([]);
    const [doctors, setDoctors] = useState(initialDoctors);
    const [medicines, setMedicines] = useState(initialMedicines);
    const [reports, setReports] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [availability, setAvailability] = useState({});

    const API_URL = API_BASE_URL;

    // Fetch Initial Data
    const fetchInitialData = useCallback(async () => {
        if (!token) return;

        try {
            // Fetch Appointments
            const apptRes = await fetch(`${API_URL}/appointments/${user.role}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (apptRes.ok) setAppointments(await apptRes.json());

            // Fetch Doctors
            const docRes = await fetch(`${API_URL}/doctors`);
            if (docRes.ok) {
                const docData = await docRes.json();
                if (docData.length > 0) setDoctors(docData);
            }

            // Fetch Medicines
            const medRes = await fetch(`${API_URL}/medicines`);
            if (medRes.ok) {
                const medData = await medRes.json();
                if (medData.length > 0) setMedicines(medData);
            }


            // Fetch Reports
            if (user.role === 'patient') {
                const repRes = await fetch(`${API_URL}/reports/patient`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (repRes.ok) setReports(await repRes.json());

                // Fetch Ambulance
                const ambRes = await fetch(`${API_URL}/ambulance/my-requests`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (ambRes.ok) setAmbulanceRequests(await ambRes.json());
            }
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    }, [token, user]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const bookAppointment = async (appointmentData) => {
        try {
            const response = await fetch(`${API_URL}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(appointmentData)
            });
            const data = await response.json();
            if (response.ok) {
                setAppointments(prev => [...prev, data]);
                return data;
            }
            throw new Error(data.message);
        } catch (error) {
            console.error('Booking error:', error);
            return null;
        }
    };

    const updateAppointmentStatus = async (appointmentId, status) => {
        try {
            const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                setAppointments(prev => prev.map(appt =>
                    appt._id === appointmentId ? { ...appt, status } : appt
                ));
            }
        } catch (error) {
            console.error('Update status error:', error);
        }
    };

    const addMedicine = async (med) => {
        try {
            const response = await fetch(`${API_URL}/medicines`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(med)
            });
            const data = await response.json();
            if (response.ok) setMedicines(prev => [...prev, data]);
        } catch (error) {
            console.error('Add medicine error:', error);
        }
    };

    const requestAmbulance = async (requestData) => {
        try {
            const response = await fetch(`${API_URL}/ambulance/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });
            const data = await response.json();
            if (response.ok) {
                setAmbulanceRequests(prev => [...prev, data]);
                return data;
            }
        } catch (error) {
            console.error('Ambulance request error:', error);
        }
    };

    // Keep UI helpers
    const addToCart = (medicine, quantity = 1) => {
        setCart(prev => {
            const mId = medicine._id || medicine.id;
            const existing = prev.find(item => (item._id || item.id) === mId);
            if (existing) {
                return prev.map(item =>
                    (item._id || item.id) === mId ? { ...item, qty: item.qty + quantity } : item
                );
            }
            return [...prev, { ...medicine, qty: quantity }];
        });
    };

    const removeFromCart = (medicineId) => setCart(prev => prev.filter(item => (item._id || item.id) !== medicineId));
    const clearCart = () => setCart([]);

    const updateAvailability = (doctorId, daysData) => {
        setAvailability(prev => ({
            ...prev,
            [doctorId]: daysData
        }));
    };

    const value = {
        appointments,
        cart,
        ambulanceRequests,
        doctors,
        medicines,
        reports,
        transactions,
        availability,
        specializations,
        bookAppointment,
        updateAppointmentStatus,
        addToCart,
        removeFromCart,
        clearCart,
        requestAmbulance,
        addMedicine,
        updateAvailability
    };

    return (
        <AppointmentContext.Provider value={value}>
            {children}
        </AppointmentContext.Provider>
    );
};
