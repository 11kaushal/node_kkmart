const { renderBuyerRegister, BuyerRegister, renderBuyerLogin, BuyerLogin, renderBuyerDashboard, renderBuyerSorry, BuyerLogout } = require("../controller/buyerController");
const { renderViewProductByBuyer } = require("../controller/productController");
const { isBuyer } = require("../middleware/isAuthorizedBuyer");
const router = require("express").Router()

router.route("/register").get(renderBuyerRegister).post(BuyerRegister)
router.route("/login").get(renderBuyerLogin).post(BuyerLogin)
router.route("/dashboard").get(isBuyer,renderBuyerDashboard)
router.route("/viewproduct/:id").get(isBuyer,renderViewProductByBuyer)
router.route("/sorry").get(isBuyer,renderBuyerSorry)                //While get requested to buy product, first verify the user exists in buyer table using middleware, if success, next buy product
router.route("/logout").get(BuyerLogout)

module.exports = router;