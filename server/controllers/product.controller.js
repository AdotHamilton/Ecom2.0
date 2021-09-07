const Product = require("../models/product.model");
const { User } = require("../models/user.model");
module.exports.getProducts = (req, res) => {
    Product.find()
        .then(allProducts => res.json({ products: allProducts }))
        .catch(err => res.json({ message: "Server error", error: err }));
};

module.exports.getManyById = async (req, res) => {
    const products = req.body;

    Product.find({ "_id": { $in: products } })
        .then(productData => res.json({products: productData}))
        .catch(err => {
            console.log(err);
            res.json({ message: "Server error", error: err })
        })

};

module.exports.getProductsByCategory = (req, res) => {
    const category = req.params.category;

    Product.find({ "category": category })
        .then(products => res.json({products: products}))
        .catch(err => {
            console.log(err);
            res.json({ message: "Server error", error: err })
        })
};


module.exports.getProductById = (req, res, id) => {
    Product.findOne({ _id: req.params.id })
        .then(oneProduct => res.json({ product: oneProduct }))
        .catch(err => res.json({ message: "Server error", error: err }));
};


module.exports.getProductByName = (req, res, name) => {
    Product.findOne({
        name: req.params.name.replace("_", " ")
    })
        .then(oneProduct => res.json({ product: oneProduct}))
        .catch(err => res.json({ message: "Product not found", error: err }));
};


module.exports.checkoutCart = async (req, res) => {
    stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
    const { email, amount, userID, products } = req.body;
    console.log(products) // products = product._id

    
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd',
        // Verify your integration in this guide by including this parameter
        metadata: {integration_check: 'accept_a_payment'},
        receipt_email: email,
    })
    await User.findByIdAndUpdate(userID, {$push: {orders: {$each:products } }})
    res.json({'client_secret': paymentIntent['client_secret']})
    

};