var express = require("express");
var router = express.Router();
const controller = require("../controller/controller");

router.get("/customers", controller.get_all_customers);
router.get("/customerById/:id", controller.get_customer_by_id);
router.get(
  "/customerByPhone/:phoneNumber",
  controller.get_customer_by_phonenumber
);
router.post("/customer", controller.create_a_customer);
router.put("/customer/:id", controller.update_customer_by_id);
router.delete("/customer/:id", controller.remove_customer_by_id);

module.exports = router;
