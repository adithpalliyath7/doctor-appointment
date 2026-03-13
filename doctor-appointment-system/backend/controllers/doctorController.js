const Doctor = require('../models/Doctor');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('user', 'name');

        // Format for frontend (combine User name into Doctor object)
        const formattedDoctors = doctors.map(doc => ({
            _id: doc._id,
            id: doc._id,
            name: doc.user ? doc.user.name : 'Unknown Doctor',
            specialization: doc.specialization,
            hospital: doc.hospital,
            fee: doc.fee,
            rating: doc.rating,
            image: doc.image,
            availability: doc.availability,
            experience: doc.experience,
            education: doc.education,
            bio: doc.bio
        }));

        res.json(formattedDoctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Seed doctors (Development only)
// @route   POST /api/doctors/seed
// @access  Public (should be protected in prod)
exports.seedDoctors = async (req, res) => {
    const User = require('../models/User');
    const doctorsData = [
        {
            name: 'Dr. Sarah Smith',
            email: 'sarah_smith@hospital.com',
            specialization: 'Cardiologist',
            hospital: 'City Heart Center',
            fee: 500,
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300'
        },
        {
            name: 'Dr. James Wilson',
            email: 'james_wilson@hospital.com',
            specialization: 'Dermatologist',
            hospital: 'Skin Care Clinic',
            fee: 400,
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300'
        },
        {
            name: 'Dr. Emily Chen',
            email: 'emily_chen@hospital.com',
            specialization: 'Pediatrician',
            hospital: 'Happy Kids Hospital',
            fee: 600,
            image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300'
        },
        {
            name: 'Dr. Michael Brown',
            email: 'michael_brown@hospital.com',
            specialization: 'General Physician',
            hospital: 'Community Health',
            fee: 300,
            image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300'
        }
    ];

    try {
        const commonPassword = 'admin@123';
        for (const doc of doctorsData) {
            let user = await User.findOne({ email: doc.email });
            if (!user) {
                user = await User.create({
                    name: doc.name,
                    email: doc.email,
                    password: commonPassword,
                    role: 'doctor',
                    isVerified: true
                });
            } else {
                // Reset password for existing users to the common one
                user.password = commonPassword;
                user.isVerified = true;
                await user.save();
            }

            let doctor = await Doctor.findOne({ user: user._id });
            if (!doctor) {
                await Doctor.create({
                    user: user._id,
                    specialization: doc.specialization,
                    hospital: doc.hospital,
                    fee: doc.fee,
                    image: doc.image
                });
            } else {
                doctor.specialization = doc.specialization;
                doctor.hospital = doc.hospital;
                doctor.fee = doc.fee;
                doctor.image = doc.image;
                await doctor.save();
            }
        }
        res.json({ message: 'Doctors seeded and passwords reset to admin@123' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
