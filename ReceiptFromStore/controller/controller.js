var { Receipt, Item, Items } = require("../model/model");

module.exports = {
  create_a_receipt: (req, res) => {
    var new_receipt = new Receipt(req.body);
    var new_items = new Items();
    for (let i = 0; i < req.body.items.length; i++) {
      var new_item = new Item(
        req.body.receiptId,
        req.body.storeId,
        i,
        req.body.items[i]
      );
      new_items.items.push(new_item);
    }

    //handles null error
    if (!new_receipt.receiptId) {
      res.status(400).send({ error: true, message: "Please provide receipt" });
    } else {
      Receipt.createReceipt(new_receipt, new_items, (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.json(result);
        }
      });
    }
  },

  get_all_receipts: (req, res) => {
    Receipt.getAllReceipts((err, result) => {
      if (err) res.send(err);
      console.log("res", result);
      res.send(result);
    });
  },

  get_all_items: (req, res) => {
    Receipt.getAllItems((err, result) => {
      if (err) res.send(err);
      console.log("res", result);
      res.send(result);
    });
  },

  get_receipt_by_receiptId_and_storeId: (req, res) => {
    let receiptId = req.params.receiptId;
    let storeId = req.params.storeId;
    Receipt.getReceiptByID(receiptId, storeId, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  },

  get_items_by_receiptId_and_storeId: (req, res) => {
    let receiptId = req.params.receiptId;
    let storeId = req.params.storeId;
    Receipt.getItemByID(receiptId, storeId, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  },

  get_full_receipt_by_receiptId_and_storeId: (req, res) => {
    let receiptId = req.params.receiptId;
    let storeId = req.params.storeId;
    Receipt.getFullReceiptByID(receiptId, storeId, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  },

  // update_receipt_by_id: (req, res) => {
  //   let id = req.params.id;
  //   let receipt = req.body;
  //   Receipt.updateReceiptById(id, receipt, (err, result) => {
  //     if (err) {
  //       res.send(err);
  //     } else {
  //       res.json(result);
  //     }
  //   });
  // },

  remove_item_by_id: (req, res) => {
    let receiptId = req.params.receiptId;
    let storeId = req.params.storeId;
    Receipt.removeItem(receiptId, storeId, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  }
};
