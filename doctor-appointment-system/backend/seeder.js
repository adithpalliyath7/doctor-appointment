const mongoose = require('mongoose');
const dotenv = require('dotenv');
// These link to the "User", "Doctor", and "Medicine" blueprints
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Medicine = require('./models/Medicine');

dotenv.config();

const restoreDatabase = async () => {
    try {
        // This connects to your local MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medi-connect-db');
        console.log('--- Starting Restoration ---');

        // CLEARING: This wipes any partial data so we start fresh
        await User.deleteMany();
        await Doctor.deleteMany();
        await Medicine.deleteMany();

        // 1. RECREATE USER (Patient) - Already verified so you don't need OTP for testing
        const patient = await User.create({
            name: 'Test Patient',
            email: 'patient@test.com',
            password: 'password123',
            role: 'patient',
            isVerified: true
        });

        // 2. RECREATE DOCTOR
        const doctorUser = await User.create({
            name: 'Dr. Sarah Smith',
            email: 'doctor@test.com',
            password: 'password123',
            role: 'doctor',
            isVerified: true
        });

        await Doctor.create({
            user: doctorUser._id,
            specialization: 'Cardiologist',
            hospital: 'City Heart Center',
            fee: 500
        });

        // 3. RECREATE MEDICINES
        await Medicine.create([
            {
                name: 'Paracetamol 500mg',
                category: 'Painkiller',
                price: 20,
                image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300'
            },
            {
                name: 'Amoxicillin 250mg',
                category: 'Antibiotic',
                price: 45,
                image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=300&h=300'
            },
            {
                name: 'Vitamin C 1000mg',
                category: 'Supplements',
                price: 150,
                image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=300&h=300'
            }
        ]);

        console.log('✅ SUCCESS: Users, Doctors, and Medicines are back!');
        console.log('--------------------------------------------------');
        console.log('Patient Login: patient@test.com / password123');
        console.log('Doctor Login: doctor@test.com / password123');
        console.log('--------------------------------------------------');
        process.exit();
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        process.exit(1);
    }
};

restoreDatabase();
