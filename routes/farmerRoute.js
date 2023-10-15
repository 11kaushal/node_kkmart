
const { renderFarmerRegister, FarmerRegister, renderFarmerLogin, FarmerLogin, renderFarmerDashboard, FarmerLogout, renderverify, sendotp, getotp, verifyotp, renderReset, reset } = require("../controller/farmerController")
const { renderViewProduct, renderAddProduct, AddProduct, renderEditProduct, EditProduct, DeleteProduct } = require("../controller/productController")
const { isProductAuthorized } = require("../middleware/isAuthorized")
const { isFarmer } = require("../middleware/isFarmer")

const router = require("express").Router()

//IMPORT MULTER//
const { multer,storage } = require("../middleware/multerConfig")
const upload = multer({storage:storage})
//////

router.route("/register").get(renderFarmerRegister).post(FarmerRegister)
router.route("/login").get(renderFarmerLogin).post(FarmerLogin)
router.route("/dashboard").get(isFarmer,renderFarmerDashboard)
router.route("/viewproduct/:id").get(isFarmer,isProductAuthorized,renderViewProduct)
router.route("/addproduct").get(isFarmer,renderAddProduct).post(isFarmer,upload.single('image'),AddProduct)      //while post request, image fieldname file stored in multerConsif Storage destination with specified filename
router.route("/editproduct/:id").get(isFarmer,isProductAuthorized,renderEditProduct).post(isFarmer,isProductAuthorized,upload.single('image'),EditProduct)
router.route("/deleteproduct/:id").get(isFarmer,isProductAuthorized,DeleteProduct)
router.route("/logout").get(isFarmer,FarmerLogout)
router.route("/verify").get(renderverify).post(sendotp)
router.route("/otp").get(getotp).post(verifyotp)
router.route("/reset").get(renderReset).post(reset)

module.exports = router