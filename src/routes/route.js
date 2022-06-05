const express = require("express");
const router = express.Router(); //used express to create route handlers
const userController = require("../controllers/userController")
const productController = require("../controllers/productController")
const cartController = require("../controllers/cartController")
const orderController = require('../controllers/orderController')


const mid = require("../middleware/authe")
//=============================user==========================================

router.post("/register", userController.createUser)

router.post("/login", userController.login)

router.get("/user/:userId/profile", mid.authentication, userController.getUser)

router.put("/user/:userId/profile", mid.authentication, mid.authorization, userController.updateUser)

//==============================================product====================================
router.get("/products", productController.productByQuery)

router.get("/products/:productId", productController.getProduct)

router.post("/products", productController.createProduct)

router.put("/products/:productId", productController.updateProduct)

router.delete("/products/:productId", productController.deleteProduct)

//==========================================cart===============================================

router.post("/users/:userId/cart", mid.authentication,mid.authorization, cartController.createCart)

router.get("/users/:userId/cart", mid.authentication, mid.authorization,cartController.getCart)

router.put("/users/:userId/cart",mid.authentication,  mid.authorization,cartController.cartUpdate)

router.delete("/users/:userId/cart", mid.authentication,  mid.authorization, cartController.deleteCart)

//===========================================order========================================

router.post("/users/:userId/orders", mid.authentication,  mid.authorization,orderController.createOrder)
router.put("/users/:userId/orders", mid.authentication,  mid.authorization,orderController.updateOrder)


module.exports = router;  