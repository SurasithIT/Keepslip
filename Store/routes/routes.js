var express = require("express");
var router = express.Router();
const controller = require("../controller/controller");

router.get("/stores", controller.get_all_stores);
router.get("/store/:id", controller.get_store_by_id);
router.post("/store", controller.create_a_store);
router.put("/store/:id", controller.update_store_by_id);
router.delete("/store/:id", controller.remove_store_by_id);

module.exports = router;
