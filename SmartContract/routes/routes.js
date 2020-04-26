var express = require("express");
var router = express.Router();
const controller = require("../controller/controller");

router.post("/receipt", controller.record_a_receipt);
router.get("/receipt/:id", controller.get_receipt);
router.get("/receiptItem/:id/:itemNumber", controller.get_item);
router.get("/receiptItems/:id", controller.get_all_item);
router.get("/receipts/", controller.get_all_receiptId);
router.get("/fullReceipt/:id", controller.get_full_receipt);

module.exports = router;
