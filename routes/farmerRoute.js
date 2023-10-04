
const { renderFarmerRegister, FarmerRegister, renderFarmerLogin, FarmerLogin, renderFarmerDashboard, FarmerLogout } = require("../controller/farmerController")
const { renderViewProduct, renderAddProduct, AddProduct, renderEditProduct, EditProduct, renderDeleteProduct } = require("../controller/productController")
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
router.route("/editproduct/:id").get(isFarmer,isProductAuthorized,renderEditProduct).post(isFarmer,isProductAuthorized,EditProduct)
router.route("/deleteproduct/:id").get(isFarmer,isProductAuthorized,renderDeleteProduct)
router.route("/logout").get(isFarmer,FarmerLogout)

module.exports = router