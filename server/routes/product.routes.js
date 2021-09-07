const express = require("express");
const { authenticate } = require("../config/jwt.config");
const productController = require("../controllers/product.controller");
module.exports = (app) => {
    app.get("/api/products", productController.getProducts);
    app.get("/api/products/:id", productController.getProductById);
    app.get("/api/products/findByName/:name", productController.getProductByName);
    app.get("/api/products/getByCategory/:category", productController.getProductsByCategory);
    app.post("/api/checkout", authenticate ,productController.checkoutCart );
    app.post("/api/products/getOrders/", productController.getManyById);
    
}
