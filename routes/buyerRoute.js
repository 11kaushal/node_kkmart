const { renderBuyerRegister, BuyerRegister, renderBuyerLogin, BuyerLogin, renderBuyerDashboard, renderBuyerSorry, BuyerLogout, renderverify, sendotp, getotp, verifyotp,renderReset, reset,  } = require("../controller/buyerController");
const { renderViewProductByBuyer } = require("../controller/productController");
const { isBuyer } = require("../middleware/isBuyer");
const router = require("express").Router()

router.route("/register").get(renderBuyerRegister).post(BuyerRegister)
router.route("/login").get(renderBuyerLogin).post(BuyerLogin)
router.route("/dashboard").get(isBuyer,renderBuyerDashboard)
router.route("/viewproduct/:id").get(isBuyer,renderViewProductByBuyer)
router.route("/sorry").get(isBuyer,renderBuyerSorry)                //While get requested to buy product, first verify the user exists in buyer table using middleware, if success, next buy product
router.route("/logout").get(isBuyer,BuyerLogout)
router.route("/verify").get(renderverify).post(sendotp)         //get request while Forgot Password link clicked, post request while verification email in submitted then email existence check and redirect to otp page
router.route("/otp").get(getotp).post(verifyotp)                //get request while email verified, post request while submitting otp then verify otp and redirect to reset password page
router.route("/reset").get(renderReset).post(reset)             //get request while otp verified, post request to set new password and update in database as well then redirect to login page

module.exports = router;