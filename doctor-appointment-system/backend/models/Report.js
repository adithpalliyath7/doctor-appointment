const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a report title']
    },
    date: {
        type: String,
        required: [true, 'Please add a date']
    },
    doctor: {
        type: String,
        required: [true, 'Please add doctor name']
    },
    type: {
        type: String,
        enum: ['Prescription', 'Pathology', 'Radiology', 'Other'],
        default: 'Prescription'
    },
    fileUrl: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
