const Medicine = require('../models/Medicine');

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Public
exports.getMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a medicine
// @route   POST /api/medicines
// @access  Private/Admin
exports.addMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.create(req.body);
        res.status(201).json(medicine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a medicine
// @route   PUT /api/medicines/:id
// @access  Private/Admin
exports.updateMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
        res.json(medicine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a medicine
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
exports.deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);
        if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
        res.json({ message: 'Medicine removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
