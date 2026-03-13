const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, 'backend/.env') });

const User = require('./backend/models/User');
const Doctor = require('./backend/models/Doctor');

const doctorsData = [
    {
        name: 'Dr. Sarah Smith',
        email: 'sarah.smith@example.com',
        specialization: 'Cardiologist',
        hospital: 'City Heart Center',
        fee: 500,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300'
    },
    {
        name: 'Dr. James Wilson',
        email: 'james.wilson@example.com',
        specialization: 'Dermatologist',
        hospital: 'Skin Care Clinic',
        fee: 400,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300'
    },
    {
        name: 'Dr. Emily Chen',
        email: 'emily.chen@example.com',
        specialization: 'Pediatrician',
        hospital: 'Happy Kids Hospital',
        fee: 600,
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300'
    },
    {
        name: 'Dr. Michael Brown',
        email: 'michael.brown@example.com',
        specialization: 'General Physician',
        hospital: 'Community Health',
        fee: 300,
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300'
    }
];

const seedDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const doc of doctorsData) {
            console.log(`Processing ${doc.name}...`);
            let user = await User.findOne({ email: doc.email });
            if (!user) {
                console.log(`User not found for ${doc.name}, creating...`);
                user = await User.create({
                    name: doc.name,
                    email: doc.email,
                    password: 'password123',
                    role: 'doctor',
                    isVerified: true
                });
                console.log(`Created user for ${doc.name}`);
            }

            console.log(`Finding doctor profile for ${user._id}...`);
            let doctor = await Doctor.findOne({ user: user._id });
            if (!doctor) {
                console.log(`Doctor profile not found for ${doc.name}, creating...`);
                await Doctor.create({
                    user: user._id,
                    specialization: doc.specialization,
                    hospital: doc.hospital,
                    fee: doc.fee,
                    image: doc.image
                });
                console.log(`Created doctor profile for ${doc.name}`);
            } else {
                console.log(`Doctor profile exists for ${doc.name}, updating...`);
                // Update existing doctor profile just in case
                doctor.specialization = doc.specialization;
                doctor.hospital = doc.hospital;
                doctor.fee = doc.fee;
                doctor.image = doc.image;
                await doctor.save();
                console.log(`Updated doctor profile for ${doc.name}`);
            }
        }

        console.log('Seeding completed');
        process.exit(0);
    } catch (err) {
        console.error('SEEDING ERROR:', err);
        process.exit(1);
    }
};

seedDoctors();
