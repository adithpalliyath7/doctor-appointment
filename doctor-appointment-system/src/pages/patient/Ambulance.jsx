import { useState, useEffect, useRef, useCallback } from 'react';
import { Siren, MapPin, Phone, AlertTriangle, Truck, CheckCircle2, Loader2, Navigation, X, MoreVertical, MessageSquare, Clock } from 'lucide-react';
import { useAppointments } from '../../context/AppointmentContext';
import { useAuth } from '../../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../../utils/api';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons
const patientIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const ambulanceIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1032/1032989.png', // Ambulance Bus Icon
    iconSize: [45, 45],
    iconAnchor: [22, 22],
    popupAnchor: [0, -20],
});

const hospitalIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Nearby Hospitals Mock Data
const NEARBY_HOSPITALS = [
    { name: 'City General Hospital', coords: [10.0215, 76.3450], distance: '1.2 km' },
    { name: 'Red Cross Medical Center', coords: [10.0120, 76.3380], distance: '2.5 km' },
    { name: 'Metro Health Hub', coords: [10.0250, 76.3320], distance: '3.1 km' }
];

function MapRecenter({ coords }) {
    const map = useMap();
    useEffect(() => {
        if (coords) map.setView(coords, map.getZoom());
    }, [coords, map]);
    return null;
}

const Ambulance = () => {
    const { requestAmbulance } = useAppointments();
    const { user } = useAuth();
    const socketRef = useRef(null);

    const [holdProgress, setHoldProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const holdTimerRef = useRef(null);
    const HOLD_DURATION = 3000;

    const [status, setStatus] = useState('idle'); // idle, searching, accepted, dispatched, arrived
    const [patientCoords, setPatientCoords] = useState([10.0159, 76.3419]); // Default Kochi
    const [driverCoords, setDriverCoords] = useState(null);
    const [vehicle, setVehicle] = useState(null);
    const [requestId, setRequestId] = useState(null);

    // Watch live location of patient
    useEffect(() => {
        let watchId = null;
        if ("geolocation" in navigator) {
            watchId = navigator.geolocation.watchPosition((position) => {
                const newCoords = [position.coords.latitude, position.coords.longitude];
                setPatientCoords(newCoords);

                if (requestId && socketRef.current) {
                    socketRef.current.emit('share_patient_location', {
                        requestId,
                        coords: { lat: newCoords[0], lng: newCoords[1] }
                    });
                }
            }, (err) => console.error(err), { enableHighAccuracy: true });
        }
        return () => { if (watchId !== null) navigator.geolocation.clearWatch(watchId); };
    }, [requestId]);

    useEffect(() => {
        socketRef.current = io(SOCKET_URL);
        socketRef.current.on('location_update', (coords) => {
            setDriverCoords([coords.lat, coords.lng]);
        });
        return () => { if (socketRef.current) socketRef.current.disconnect(); };
    }, []);

    const handleSOS = useCallback(async () => {
        setStatus('searching');
        try {
            const res = await requestAmbulance({
                patientId: user?.id,
                patientName: user?.name,
                patientLocation: { lat: patientCoords[0], lng: patientCoords[1], address: "Emergency Location" },
                emergency: true
            });

            if (res && res._id) {
                setRequestId(res._id.substring(res._id.length - 12).toUpperCase());
                socketRef.current.emit('join_request', res._id);
            }

            setTimeout(() => {
                setStatus('accepted');
                setVehicle({
                    plate: 'KL 07 BQ 4562',
                    driver: 'Sunil Ahlawat',
                    phone: '+91 99887 76655',
                    eta: '12 MINS'
                });

                // Mock road-like route points
                const route = [
                    [patientCoords[0] + 0.015, patientCoords[1] + 0.015],
                    [patientCoords[0] + 0.015, patientCoords[1] + 0.005],
                    [patientCoords[0] + 0.005, patientCoords[1] + 0.005],
                    [patientCoords[0] + 0.005, patientCoords[1]],
                    [patientCoords[0], patientCoords[1]]
                ];

                let idx = 0;
                setDriverCoords(route[0]);

                const moveTimer = setInterval(() => {
                    idx++;
                    if (idx >= route.length) {
                        setStatus('arrived');
                        setVehicle(v => ({ ...v, eta: 'ARRIVED' }));
                        clearInterval(moveTimer);
                        return;
                    }

                    const nextPos = route[idx];
                    setDriverCoords(nextPos);

                    if (socketRef.current) {
                        socketRef.current.emit('update_location', {
                            requestId: res?._id,
                            lat: nextPos[0],
                            lng: nextPos[1]
                        });
                    }
                }, 3000); // Step every 3 seconds for visible movement
            }, 4000);

        } catch (error) {
            console.error("Ambulance request failed", error);
            setStatus('idle');
        }
    }, [user, patientCoords, requestAmbulance]);

    useEffect(() => {
        if (isHolding) {
            const startTime = Date.now();
            holdTimerRef.current = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
                setHoldProgress(progress);
                if (progress >= 100) {
                    setIsHolding(false);
                    setHoldProgress(0);
                    handleSOS();
                }
            }, 50);
        } else {
            clearInterval(holdTimerRef.current);
        }
        return () => clearInterval(holdTimerRef.current);
    }, [isHolding, handleSOS]);

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <button className="text-slate-500 hover:text-slate-800 transition-colors">
                        <X size={28} />
                    </button>
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                            <h2 className="text-[15px] font-black uppercase text-slate-800 tracking-tight">
                                EMERGENCY #{requestId || 'PENDING'}
                            </h2>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | HIGH PRIORITY
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="text-orange-500 font-black text-sm uppercase tracking-wider hover:bg-orange-50 px-3 py-1 rounded-lg">HELP</button>
                    <MoreVertical size={20} className="text-slate-400" />
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative">
                {status === 'idle' ? (
                    <div className="h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 space-y-6">
                        <div className="relative group">
                            <svg className="w-48 h-48 transform -rotate-90">
                                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={502} strokeDashoffset={502 - (502 * holdProgress) / 100} strokeLinecap="round" className="text-red-500 transition-all duration-75" />
                            </svg>
                            <button
                                onMouseDown={() => setIsHolding(true)}
                                onMouseUp={() => { setIsHolding(false); setHoldProgress(0); }}
                                onMouseLeave={() => { setIsHolding(false); setHoldProgress(0); }}
                                onTouchStart={() => setIsHolding(true)}
                                onTouchEnd={() => { setIsHolding(false); setHoldProgress(0); }}
                                className="absolute inset-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex flex-col items-center justify-center shadow-2xl transition-all active:scale-95"
                            >
                                <span className="text-3xl font-black">SOS</span>
                                <span className="text-[10px] font-bold mt-1 uppercase">Hold to book</span>
                            </button>
                        </div>
                        <p className="font-bold text-slate-500 text-center max-w-xs">Connecting you to the nearest ambulance in seconds</p>
                    </div>
                ) : (
                    <MapContainer center={patientCoords} zoom={14} className="h-full w-full">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {/* Route Line */}
                        {driverCoords && (
                            <Polyline
                                positions={[driverCoords, patientCoords]}
                                pathOptions={{ color: '#F97316', weight: 6, opacity: 0.8, lineCap: 'round' }}
                            />
                        )}

                        {/* Patient Marker */}
                        <Marker position={patientCoords} icon={patientIcon}>
                            <Popup>Your Location</Popup>
                        </Marker>

                        {/* Driver Marker */}
                        {driverCoords && (
                            <Marker position={driverCoords} icon={ambulanceIcon}>
                                <div className="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black absolute -top-10 left-1/2 -translate-x-1/2 shadow-xl whitespace-nowrap">
                                    ETA : {vehicle?.eta}
                                </div>
                                <Popup>Ambulance En Route</Popup>
                            </Marker>
                        )}

                        {/* Nearby Hospitals */}
                        {NEARBY_HOSPITALS.map((h, i) => (
                            <Marker key={i} position={h.coords} icon={hospitalIcon}>
                                <Popup>
                                    <div className="p-2">
                                        <p className="font-bold">{h.name}</p>
                                        <p className="text-[10px] text-slate-500">{h.distance} away</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        <MapRecenter coords={driverCoords || patientCoords} />
                    </MapContainer>
                )}
            </div>

            {/* Bottom Status Card */}
            {status !== 'idle' && (
                <div className="bg-white border-t rounded-t-[2.5rem] shadow-2xl p-6 space-y-6 z-30 animate-in slide-in-from-bottom-5">
                    <div className="flex items-center space-x-4">
                        <div className="bg-slate-100 p-2 rounded-xl">
                            <Clock className="text-slate-400" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-slate-800 leading-tight">
                                {status === 'searching' && 'Finding nearest ambulance...'}
                                {status === 'accepted' && 'Ambulance Dispatched'}
                                {status === 'arrived' && 'Ambulance Arrived'}
                            </h3>
                            <p className="text-sm font-medium text-slate-500">
                                {status === 'searching' && 'Requesting emergency response...'}
                                {status === 'accepted' && `${vehicle?.driver} has accepted your request.`}
                                {status === 'arrived' && 'Please proceed to the ambulance area.'}
                            </p>
                        </div>
                        <div className="bg-slate-200 w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
                            {vehicle ? (
                                <img src={`https://ui-avatars.com/api/?name=${vehicle.driver}&background=random`} alt="Driver" />
                            ) : (
                                <Loader2 size={32} className="text-slate-400 animate-spin" />
                            )}
                        </div>
                    </div>

                    {status === 'accepted' && (
                        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-start space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 animate-pulse"></div>
                            <p className="text-[13px] font-bold text-blue-800 leading-relaxed">
                                Expecting a quick arrival. Traffic is moderate on your route.
                                <span className="block text-[11px] font-medium text-blue-600/80 mt-1 uppercase tracking-tight">Stay calm, help is near.</span>
                            </p>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VEHICLE INFO</span>
                            <span className="text-lg font-black text-slate-800">{vehicle?.plate || 'KL 07 XX 0000'}</span>
                        </div>
                        <div className="flex space-x-3">
                            <button className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-sm transition-all active:scale-95">
                                <MessageSquare size={24} />
                            </button>
                            <button className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95 ring-4 ring-orange-50">
                                <Phone size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ambulance;
