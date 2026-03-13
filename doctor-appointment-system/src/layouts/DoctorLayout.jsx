import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, Users, FileText, Clock, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DoctorLayout = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#F8F9FA] md:pl-64">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed left-0 top-0 bottom-0 z-50">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-2xl font-bold text-[#49B3A3]">MediConnect</h1>
                    <p className="text-xs text-[#49B3A3] mt-1 font-semibold uppercase tracking-wider">Doctor Portal</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem to="/doctor/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={isActive('/doctor/dashboard')} />
                    <NavItem to="/doctor/appointments" icon={<CalendarCheck size={20} />} label="Appointments" active={isActive('/doctor/appointments')} />
                    <NavItem to="/doctor/patients" icon={<Users size={20} />} label="My Patients" active={isActive('/doctor/patients')} />
                    <NavItem to="/doctor/schedule" icon={<Clock size={20} />} label="Schedule & Availability" active={isActive('/doctor/schedule')} />
                    <NavItem to="/doctor/profile" icon={<User size={20} />} label="My Profile" active={isActive('/doctor/profile')} />
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button onClick={logout} className="flex items-center space-x-3 text-slate-500 hover:text-red-600 w-full p-2 rounded-lg transition-colors">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="bg-white p-4 shadow-sm md:hidden flex justify-between items-center sticky top-0 z-50">
                <span className="font-bold text-xl text-[#49B3A3]">MediConnect Doctor</span>
                <button onClick={logout} className="p-2 text-slate-500 hover:text-red-500">
                    <LogOut size={20} />
                </button>
            </div>

            <main className="p-6 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
};

const NavItem = ({ to, icon, label, active }) => (
    <Link to={to} className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${active ? 'bg-[#49B3A3]/10 text-[#49B3A3] font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
        {icon}
        <span>{label}</span>
    </Link>
);

export default DoctorLayout;
