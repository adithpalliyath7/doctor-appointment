const express = require('express');
const router = express.Router();
const { getPatientReports, addReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/patient', protect, getPatientReports);
router.post('/', protect, addReport);

module.exports = router;
