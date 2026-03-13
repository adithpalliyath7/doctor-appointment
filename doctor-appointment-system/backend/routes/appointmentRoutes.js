const express = require('express');
const router = express.Router();
const { bookAppointment, getPatientAppointments, getDoctorAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, bookAppointment);

router.get('/patient', protect, getPatientAppointments);
router.get('/doctor', protect, getDoctorAppointments);
router.put('/:id', protect, updateAppointmentStatus);

module.exports = router;
