const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    date: {
        type: String,
        required: [true, 'Please add a date']
    },
    time: {
        type: String,
        required: [true, 'Please add a time']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'rejected'],
        default: 'pending'
    },
    problem: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);
