const mongoose = require('mongoose');

const ambulanceRequestSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    patientLocation: {
        lat: Number,
        lng: Number,
        address: String
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    driverLocation: {
        lat: Number,
        lng: Number
    },
    emergency: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['searching', 'accepted', 'dispatched', 'arrived', 'completed', 'cancelled'],
        default: 'searching'
    },
    vehicleDetails: {
        plate: String,
        phone: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AmbulanceRequest', ambulanceRequestSchema);
