const { renderBuyerRegister, BuyerRegister, renderBuyerLogin, BuyerLogin, renderBuyerDashboard, renderBuyerSorry } = require("../controller/buyerController");
const { renderViewProductByBuyer } = require("../controller/productController");

const router = require("express").Router()

router.route("/register").get(renderBuyerRegister).post(BuyerRegister)
router.route("/login").get(renderBuyerLogin).post(BuyerLogin)
router.route("/dashboard").get(renderBuyerDashboard)
router.route("/viewproduct/:id").get(renderViewProductByBuyer)
router.route("/sorry").get(renderBuyerSorry)

module.exports = router;