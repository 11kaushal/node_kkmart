
const { renderFarmerRegister, FarmerRegister, renderFarmerLogin, FarmerLogin, renderFarmerDashboard } = require("../controller/farmerController")
const { renderViewProduct, renderAddProduct, AddProduct, renderEditProduct, EditProduct, renderDeleteProduct } = require("../controller/productController")

const router = require("express").Router()

router.route("/register").get(renderFarmerRegister).post(FarmerRegister)
router.route("/login").get(renderFarmerLogin).post(FarmerLogin)
router.route("/dashboard").get(renderFarmerDashboard)
router.route("/viewproduct/:id").get(renderViewProduct)
router.route("/addproduct").get(renderAddProduct).post(AddProduct)
router.route("/editproduct/:id").get(renderEditProduct).post(EditProduct)
router.route("/deleteproduct/:id").get(renderDeleteProduct)

module.exports = router