const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
        required: [true, 'Please add a specialization']
    },
    hospital: {
        type: String,
        required: [true, 'Please add a hospital']
    },
    fee: {
        type: Number,
        required: [true, 'Please add a consulting fee']
    },
    rating: {
        type: Number,
        default: 4.5
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    experience: {
        type: String,
        default: '10+ Years'
    },
    education: {
        type: String,
        default: 'MBBS, MD'
    },
    bio: {
        type: String,
        default: 'Experienced medical professional dedicated to providing high-quality patient care.'
    },
    availability: [{
        day: String,
        slots: [String]
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
