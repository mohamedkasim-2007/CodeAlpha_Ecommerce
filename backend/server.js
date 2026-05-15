require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send("E-commerce API Running");
});

app.post('/register', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.send("User Registered");
});

app.post('/login', async (req, res) => {
    const user = await User.findOne(req.body);
    if (!user) return res.send("Invalid");
    res.send("Login Success");
});

app.post('/add-product', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.send("Product Added");
});

app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.delete('/delete-product/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.send("Product Deleted");
    } catch (err) {
        res.status(500).send("Error deleting product");
    }
});

app.post('/cart/add', async (req, res) => {
    const { userId, productId, name, price } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = new Cart({ userId, items: [] });
    }

    const item = cart.items.find(i => i.productId === productId);

    if (item) {
        item.quantity++;
    } else {
        cart.items.push({ productId, name, price, quantity: 1 });
    }

    await cart.save();

    res.send("Added to cart");
});

app.get('/cart/:userId', async (req, res) => {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { items: [] });
});

app.post('/cart/remove', async (req, res) => {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) return res.send("No cart");

    cart.items = cart.items.filter(i => i.productId !== productId);

    await cart.save();

    res.send("Removed");
});

app.post('/order/place', async (req, res) => {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
        return res.send("Cart empty");
    }

    let total = 0;

    cart.items.forEach(i => {
        total += i.price * i.quantity;
    });

    const order = new Order({
        userId,
        items: cart.items,
        totalAmount: total
    });

    await order.save();

    cart.items = [];
    await cart.save();

    res.send("Order Placed");
});

app.get('/order/:userId', async (req, res) => {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
});

app.listen(5000, () => {
    console.log("Server running on 5000");
});