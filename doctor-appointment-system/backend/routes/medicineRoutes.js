const express = require('express');
const router = express.Router();
const { getMedicines, addMedicine, updateMedicine, deleteMedicine } = require('../controllers/medicineController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getMedicines)
    .post(protect, addMedicine);

router.route('/:id')
    .put(protect, updateMedicine)
    .delete(protect, deleteMedicine);

module.exports = router;
