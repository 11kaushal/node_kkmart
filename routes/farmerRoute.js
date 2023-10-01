
const { renderFarmerRegister, FarmerRegister, renderFarmerLogin, FarmerLogin, renderFarmerDashboard, FarmerLogout } = require("../controller/farmerController")
const { renderViewProduct, renderAddProduct, AddProduct, renderEditProduct, EditProduct, renderDeleteProduct } = require("../controller/productController")
const { isFarmer } = require("../middleware/isAuthorizedFarmer")

const router = require("express").Router()

router.route("/register").get(renderFarmerRegister).post(FarmerRegister)
router.route("/login").get(renderFarmerLogin).post(FarmerLogin)
router.route("/dashboard").get(isFarmer,renderFarmerDashboard)
router.route("/viewproduct/:id").get(isFarmer,renderViewProduct)
router.route("/addproduct").get(isFarmer,renderAddProduct).post(isFarmer,AddProduct)      //While post requested to add product, first verify the user in farmer table using middleware, if success, next add product
router.route("/editproduct/:id").get(isFarmer,renderEditProduct).post(isFarmer,EditProduct)
router.route("/deleteproduct/:id").get(isFarmer,renderDeleteProduct)
router.route("/logout").get(isFarmer,FarmerLogout)

module.exports = router