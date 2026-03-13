const AmbulanceRequest = require('../models/AmbulanceRequest');

// @desc    Request an ambulance
// @route   POST /api/ambulance/request
// @access  Private
exports.requestAmbulance = async (req, res) => {
    try {
        const { patientName, patientLocation, emergency } = req.body;

        const ambulanceRequest = await AmbulanceRequest.create({
            patient: req.user.id,
            patientName,
            patientLocation,
            emergency,
            status: 'searching'
        });

        // In a real app, we would broadcast this to drivers via sockets
        // For now, we return the request which the frontend will simulate acceptance for
        res.status(201).json(ambulanceRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get patient ambulance history
// @route   GET /api/ambulance/my-requests
// @access  Private
exports.getMyAmbulanceRequests = async (req, res) => {
    try {
        const requests = await AmbulanceRequest.find({ patient: req.user.id });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
