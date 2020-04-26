var express = require("express");
var router = express.Router();
const controller = require("../controller/controller");

router.post("/storeFromTRD", controller.get_store);

module.exports = router;
