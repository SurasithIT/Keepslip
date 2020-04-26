// module.exports = function(app) {
var express = require("express");
var router = express.Router();
const controller = require("../controller/controller");

router.get("/receipts", controller.get_all_receipts);
router.get("/receipt/:id", controller.get_receipt_by_id);
router.get("/receiptByCustomer/:id", controller.get_receipt_by_customer_id);
router.get("/receiptByStore/:id", controller.get_receipt_by_store_id);
router.post("/receipt", controller.create_a_receipt);
// router.put("/receipt/:id", controller.update_receipt_by_id);
router.delete("/receipt/:id", controller.remove_receipt_by_id);

module.exports = router;
