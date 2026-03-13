const express = require('express');
const router = express.Router();
const { requestAmbulance, getMyAmbulanceRequests } = require('../controllers/ambulanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request', protect, requestAmbulance);
router.get('/my-requests', protect, getMyAmbulanceRequests);

module.exports = router;
