const mongoose = require('mongoose');

module.exports = mongoose.model('Cart', {
    userId: String,
    items: [
        {
            productId: String,
            name: String,
            price: Number,
            quantity: Number
        }
    ]
});