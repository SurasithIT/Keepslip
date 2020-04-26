var express = require("express");
var router = express.Router();
const controller = require("../controller/controller");

router.get("/receipts", controller.get_all_receipts);
router.get(
  "/receipt/:storeId/:receiptId",
  controller.get_receipt_by_receiptId_and_storeId
);
router.get("/items", controller.get_all_items);
router.get(
  "/item/:storeId/:receiptId",
  controller.get_items_by_receiptId_and_storeId
);
router.get(
  "/fullReceipt/:storeId/:receiptId",
  controller.get_full_receipt_by_receiptId_and_storeId
);
router.post("/receipt", controller.create_a_receipt);
// router.put("/receipt/:receiptId/:storeId", controller.update_receipt_by_id);
router.delete("/receipt/:receiptId/:storeId", controller.remove_item_by_id);

module.exports = router;
