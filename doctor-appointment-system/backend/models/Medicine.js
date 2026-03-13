const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a medicine name'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    stock: {
        type: Number,
        default: 100
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Medicine', medicineSchema);
