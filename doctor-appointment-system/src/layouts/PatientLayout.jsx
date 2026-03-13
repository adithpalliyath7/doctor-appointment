import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Calendar, User, FileText, ShoppingBag, Ambulance, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PatientLayout = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-20 md:pb-0 md:pl-64">
            {/* Mobile Header */}
            <div className="bg-white p-4 shadow-sm md:hidden flex justify-between items-center sticky top-0 z-50">
                <span className="font-bold text-xl text-[#49B3A3]">MediConnect</span>
                <button onClick={logout} className="p-2 text-slate-500 hover:text-red-500">
                    <LogOut size={20} />
                </button>
            </div>

            {/* Sidebar (Desktop) */}
            <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed left-0 top-0 bottom-0 z-50">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-2xl font-bold text-[#49B3A3]">MediConnect</h1>
                    <p className="text-xs text-slate-400 mt-1">Patient Portal</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <NavItem to="/patient/dashboard" icon={<Home size={20} />} label="Dashboard" active={isActive('/patient/dashboard')} />
                    <NavItem to="/patient/appointments" icon={<Calendar size={20} />} label="Appointments" active={isActive('/patient/appointments')} />
                    <NavItem to="/patient/medicines" icon={<ShoppingBag size={20} />} label="Medicines" active={isActive('/patient/medicines')} />
                    <NavItem to="/patient/ambulance" icon={<Ambulance size={20} />} label="Ambulance" active={isActive('/patient/ambulance')} />
                    <NavItem to="/patient/reports" icon={<FileText size={20} />} label="Reports" active={isActive('/patient/reports')} />
                    <NavItem to="/patient/profile" icon={<User size={20} />} label="Profile" active={isActive('/patient/profile')} />
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button onClick={logout} className="flex items-center space-x-3 text-slate-500 hover:text-red-600 w-full p-2 rounded-lg transition-colors">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="p-4 md:p-8 max-w-7xl mx-auto">
                <Outlet />
            </main>

            {/* Bottom Nav (Mobile) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50">
                <MobileNavItem to="/patient/dashboard" icon={<Home size={24} />} active={isActive('/patient/dashboard')} />
                <MobileNavItem to="/patient/appointments" icon={<Calendar size={24} />} active={isActive('/patient/appointments')} />
                <MobileNavItem to="/patient/medicines" icon={<ShoppingBag size={24} />} active={isActive('/patient/medicines')} />
                <MobileNavItem to="/patient/profile" icon={<User size={24} />} active={isActive('/patient/profile')} />
            </div>
        </div>
    );
};

// Helper Components
const NavItem = ({ to, icon, label, active }) => (
    <Link to={to} className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${active ? 'bg-[#49B3A3]/10 text-[#49B3A3] font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
        {icon}
        <span>{label}</span>
    </Link>
);

const MobileNavItem = ({ to, icon, active }) => (
    <Link to={to} className={`p-2 rounded-full ${active ? 'text-[#49B3A3]' : 'text-slate-400'}`}>
        {icon}
    </Link>
);

export default PatientLayout;
