const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const jwtVerify = require("./jwtVerify");

router.post("/customer-login", controller.customer_login);
router.post("/store-login", controller.store_login);
router.delete("/logout", controller.logout);
router.get("/verify", jwtVerify.userVerify, (req, res) => {
  res.send(req.user);
});
router.get("/customer-verify", jwtVerify.customerVerify, (req, res) => {
  res.send(req.user);
});
router.get("/store-verify", jwtVerify.storeVerify, (req, res) => {
  res.send(req.user);
});
module.exports = router;
