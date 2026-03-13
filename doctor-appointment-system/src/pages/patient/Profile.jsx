import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Calendar, Droplets } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [, setIsSaved] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '+91 98765 43210',
        location: user?.location || 'Kerala, India',
        bloodGroup: user?.bloodGroup || 'O+',
        dob: user?.dob || '1995-08-15'
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '+91 98765 43210',
                location: user.location || 'Kerala, India',
                bloodGroup: user.bloodGroup || 'O+',
                dob: user.dob || '1995-08-15'
            });
        }
    }, [user]);

    const handleSave = async () => {
        const result = await updateUser(formData);
        if (result.success) {
            setIsEditing(false);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } else {
            alert(result.message || 'Failed to update profile');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-black text-slate-800">My Health Profile</h1>

            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5">
                <div className="h-48 bg-gradient-to-r from-primary to-primary-dark"></div>
                <div className="px-10 pb-10">
                    <div className="relative flex justify-between items-end -mt-20 mb-10">
                        <div className="bg-white p-1.5 rounded-[2rem] shadow-2xl">
                            <div className="w-40 h-40 bg-slate-50 rounded-[1.8rem] flex items-center justify-center text-primary text-5xl font-black border-4 border-white shadow-inner">
                                {user?.name ? user.name[0] : 'U'}
                            </div>
                        </div>
                        <div className="flex space-x-4 mb-4">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white border border-slate-200 text-slate-600 px-8 py-3.5 rounded-2xl font-black text-sm flex items-center space-x-3 hover:bg-slate-50 transition-all shadow-lg active:scale-95 group"
                                >
                                    <Edit2 size={20} className="group-hover:rotate-12 transition-transform" />
                                    <span>EDIT PROFILE</span>
                                </button>
                            ) : (
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="bg-white border border-slate-200 text-slate-600 px-8 py-3.5 rounded-2xl font-black text-sm flex items-center space-x-3 hover:bg-slate-50 transition-all active:scale-95"
                                    >
                                        <X size={20} />
                                        <span>CANCEL</span>
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="bg-primary text-white px-10 py-3.5 rounded-2xl font-black text-sm flex items-center space-x-3 hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95"
                                    >
                                        <Save size={20} />
                                        <span>SAVE CHANGES</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-12">
                        {isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.2rem] focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-slate-800 font-bold text-lg"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.2rem] focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-slate-800 font-bold text-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-5xl font-black text-slate-800 tracking-tight leading-none mb-4">{formData.name || 'Guest User'}</h1>
                                <p className="text-slate-400 font-bold flex items-center text-lg tracking-wide">
                                    <Mail size={20} className="mr-3 text-primary/60" />
                                    {formData.email || 'email@example.com'}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <ProfileField isEditing={isEditing} label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} icon={<Phone size={20} />} />
                            <ProfileField isEditing={isEditing} label="State / Location" name="location" value={formData.location} onChange={handleChange} icon={<MapPin size={20} />} />
                            <ProfileField isEditing={isEditing} label="Date of Birth" name="dob" value={formData.dob} onChange={handleChange} icon={<Calendar size={20} />} type="date" />
                            <ProfileField isEditing={isEditing} label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} icon={<Droplets size={20} />} />
                        </div>

                        {!isEditing && (
                            <div className="pt-8 border-t border-slate-100 flex flex-wrap gap-4">
                                <span className="bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100">Profile Verified</span>
                                <span className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100">Patient ID: #MC-{user?.id?.slice(-6).toUpperCase() || 'NEW'}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileField = ({ isEditing, label, name, value, onChange, icon, type = "text" }) => (
    <div className={`p-6 rounded-[1.8rem] transition-all duration-300 ${isEditing ? 'bg-white border-2 border-primary/10 shadow-lg shadow-primary/5' : 'bg-slate-50 border border-slate-50 hover:bg-slate-100/70'}`}>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mb-3 ml-1">{label}</p>
        <div className="flex items-center space-x-3">
            {isEditing ? (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent border-b-2 border-slate-200 focus:border-primary outline-none py-1.5 text-slate-800 font-black text-lg transition-colors"
                />
            ) : (
                <div className="flex items-center space-x-3 text-slate-800 font-black text-lg">
                    {icon && <span className="text-primary/70">{icon}</span>}
                    <span className={name === 'bloodGroup' ? 'text-red-500' : ''}>{value}</span>
                </div>
            )}
        </div>
    </div>
);

export default Profile;
