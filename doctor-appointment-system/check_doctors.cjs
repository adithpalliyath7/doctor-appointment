const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const Doctor = require('../backend/models/Doctor');
const User = require('../backend/models/User');

const checkDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const doctors = await Doctor.find().populate('user', 'name email');
        console.log('Doctors in DB:', JSON.stringify(doctors, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDoctors();
