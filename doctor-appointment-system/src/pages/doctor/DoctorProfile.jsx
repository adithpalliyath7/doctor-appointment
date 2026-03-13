import { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Award, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DoctorProfile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [, setIsSaved] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '+91 98765 43210',
        specialization: user?.specialization || 'General Physician',
        hospital: user?.hospital || 'City General Hospital',
        experience: user?.experience || '10+ Years',
        education: user?.education || 'MBBS, MD',
        bio: user?.bio || 'Experienced medical professional dedicated to providing high-quality patient care.'
    });

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
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">My Professional Profile</h1>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="h-40 bg-gradient-to-r from-[#49B3A3] to-[#3a8f82]"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-16 mb-8">
                        <div className="bg-white p-1 rounded-3xl shadow-xl">
                            <div className="w-32 h-32 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-[#49B3A3] text-4xl font-black">
                                {user?.name ? user.name.split(' ').pop()[0] : 'D'}
                            </div>
                        </div>
                        <div className="flex space-x-3 mb-2">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                                >
                                    <Edit2 size={16} />
                                    <span>Edit Professional Info</span>
                                </button>
                            ) : (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 hover:bg-slate-50 transition-all active:scale-95"
                                    >
                                        <X size={16} />
                                        <span>Cancel</span>
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="bg-[#49B3A3] text-white px-8 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 hover:bg-[#3a8f82] transition-all shadow-lg shadow-[#49B3A3]/20 active:scale-95"
                                    >
                                        <Save size={16} />
                                        <span>Save Profile</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        {isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                                <FormInput label="Email Address" name="email" value={formData.email} onChange={handleChange} type="email" />
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center space-x-3">
                                    <h1 className="text-3xl font-black text-slate-800">{formData.name}</h1>
                                    <span className="bg-[#49B3A3]/10 text-[#49B3A3] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Verified Expert</span>
                                </div>
                                <div className="flex flex-wrap gap-4 mt-3">
                                    <p className="text-slate-500 font-bold flex items-center text-sm">
                                        <Award size={16} className="mr-2 text-[#49B3A3]" />
                                        {formData.specialization}
                                    </p>
                                    <p className="text-slate-500 font-bold flex items-center text-sm">
                                        <Mail size={16} className="mr-2 text-[#49B3A3]" />
                                        {formData.email}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ProfileField isEditing={isEditing} label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} icon={<Award size={18} />} />
                            <ProfileField isEditing={isEditing} label="Hospital/Clinic" name="hospital" value={formData.hospital} onChange={handleChange} icon={<MapPin size={18} />} />
                            <ProfileField isEditing={isEditing} label="Education" name="education" value={formData.education} onChange={handleChange} icon={<Award size={18} />} />
                            <ProfileField isEditing={isEditing} label="Experience" name="experience" value={formData.experience} onChange={handleChange} icon={<Briefcase size={18} />} />
                            <ProfileField isEditing={isEditing} label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} icon={<Phone size={18} />} />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Professional Bio</label>
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#49B3A3]/20 focus:border-[#49B3A3] outline-none transition-all text-slate-700 font-medium resize-none"
                                />
                            ) : (
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <p className="text-slate-600 leading-relaxed font-medium">{formData.bio}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FormInput = ({ label, name, value, onChange, type = "text" }) => (
    <div className="space-y-2">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#49B3A3]/20 focus:border-[#49B3A3] outline-none transition-all text-slate-700 font-bold"
        />
    </div>
);

const ProfileField = ({ isEditing, label, name, value, onChange, icon }) => (
    <div className={`p-5 rounded-2xl transition-all ${isEditing ? 'bg-white border-2 border-[#49B3A3]/10 shadow-sm' : 'bg-slate-50 border border-slate-50'}`}>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{label}</p>
        <div className="flex items-center space-x-3">
            {isEditing ? (
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent border-b-2 border-slate-100 focus:border-[#49B3A3] outline-none py-1 text-slate-700 font-bold"
                />
            ) : (
                <div className="flex items-center space-x-2 text-slate-700 font-bold">
                    {icon && <span className="text-[#49B3A3]">{icon}</span>}
                    <span>{value}</span>
                </div>
            )}
        </div>
    </div>
);

export default DoctorProfile;
