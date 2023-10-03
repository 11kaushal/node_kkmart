
const { renderFarmerRegister, FarmerRegister, renderFarmerLogin, FarmerLogin, renderFarmerDashboard, FarmerLogout } = require("../controller/farmerController")
const { renderViewProduct, renderAddProduct, AddProduct, renderEditProduct, EditProduct, renderDeleteProduct } = require("../controller/productController")
const { isProductAuthorized } = require("../middleware/isAuthorized")
const { isFarmer } = require("../middleware/isFarmer")

const router = require("express").Router()

router.route("/register").get(renderFarmerRegister).post(FarmerRegister)
router.route("/login").get(renderFarmerLogin).post(FarmerLogin)
router.route("/dashboard").get(isFarmer,renderFarmerDashboard)
router.route("/viewproduct/:id").get(isFarmer,isProductAuthorized,renderViewProduct)
router.route("/addproduct").get(isFarmer,renderAddProduct).post(isFarmer,AddProduct)      //While post requested to add product, first verify the user in farmer table using middleware, if success, next add product
router.route("/editproduct/:id").get(isFarmer,isProductAuthorized,renderEditProduct).post(isFarmer,isProductAuthorized,EditProduct)
router.route("/deleteproduct/:id").get(isFarmer,isProductAuthorized,renderDeleteProduct)
router.route("/logout").get(isFarmer,FarmerLogout)

module.exports = router