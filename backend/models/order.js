const mongoose = require('mongoose');

module.exports = mongoose.model('Order', {
    userId: String,
    items: Array,
    totalAmount: Number,
    status: { type: String, default: "Placed" }
});