const Appointment = require('../models/Appointment');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private
exports.bookAppointment = async (req, res) => {
    try {
        console.log('Booking request received:', req.body);
        console.log('User from token:', req.user);
        const { doctorId, date, time, problem } = req.body;

        if (!doctorId) {
            return res.status(400).json({ message: 'Doctor ID is required' });
        }

        let appointment = await Appointment.create({
            patient: req.user._id,
            doctor: doctorId,
            date,
            time,
            problem: problem || 'General Consultation'
        });

        appointment = await appointment.populate('doctor', 'name specialization hospital');

        console.log('Appointment created:', appointment);
        res.status(201).json(appointment);
    } catch (error) {
        console.error('Booking Controller Error:', error);
        res.status(400).json({ message: error.message });
    }
};


// @desc    Get patient appointments
// @route   GET /api/appointments/patient
// @access  Private
exports.getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.id })
            .populate('doctor', 'name specialization hospital');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get doctor appointments
// @route   GET /api/appointments/doctor
// @access  Private
exports.getDoctorAppointments = async (req, res) => {
    try {
        // Find doctor profile for this user
        const appointments = await Appointment.find({ doctor: req.user.id })
            .populate('patient', 'name email');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        res.json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
