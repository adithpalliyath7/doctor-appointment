const Report = require('../models/Report');

// @desc    Get patient medical reports
// @route   GET /api/reports/patient
// @access  Private
exports.getPatientReports = async (req, res) => {
    try {
        const reports = await Report.find({ patient: req.user.id });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a report (usually by doctor or admin)
// @route   POST /api/reports
// @access  Private
exports.addReport = async (req, res) => {
    try {
        const { patientId, title, date, doctor, type, fileUrl } = req.body;
        const report = await Report.create({
            patient: patientId,
            title,
            date,
            doctor,
            type,
            fileUrl
        });
        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
