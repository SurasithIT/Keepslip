var express = require("express");
var router = express.Router();
const customerController = require("../controller/customerController");
const storeController = require("../controller/storeController");
const receiptController = require("../controller/receiptController");

router.get("/customers", customerController.get_all_customers);
router.get("/customerById/:id", customerController.get_customer_by_id);
router.get(
  "/customerByPhone/:phoneNumber",
  customerController.get_customer_by_phonenumber
);
router.post("/customer", customerController.create_a_customer);
router.put("/customer/:id", customerController.update_customer_by_id);
router.delete("/customer/:id", customerController.remove_customer_by_id);

router.get("/stores", storeController.get_all_stores);
router.get("/store/:id", storeController.get_store_by_id);
router.post("/store", storeController.create_a_store);
router.put("/store/:id", storeController.update_store_by_id);
router.delete("/store/:id", storeController.remove_store_by_id);

router.get("/receipts", receiptController.get_all_receipts);
router.get("/receipt/:id", receiptController.get_receipt_by_id);
router.get(
  "/receiptByCustomer/:id",
  receiptController.get_receipt_by_customer_id
);
router.get("/receiptByStore/:id", receiptController.get_receipt_by_store_id);
router.post("/receipt", receiptController.create_a_receipt);
// router.put("/receipt/:id", receiptController.update_receipt_by_id);
router.delete("/receipt/:id", receiptController.remove_receipt_by_id);

module.exports = router;
