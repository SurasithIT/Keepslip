var Receipt = require("../model/receiptModel");
module.exports = {
  create_a_receipt: (req, res) => {
    var new_receipt = new Receipt(req.body);

    //handles null error
    if (!new_receipt.receiptId) {
      res.status(400).send({ error: true, message: "Please provide receipt" });
    } else {
      Receipt.createReceipt(new_receipt, (err, result) => {
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

  get_receipt_by_id: (req, res) => {
    let id = req.params.id;
    Receipt.getReceiptByID(id, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  },

  get_receipt_by_customer_id: (req, res) => {
    let id = req.params.id;
    Receipt.getReceiptByCustomerID(id, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  },

  get_receipt_by_store_id: (req, res) => {
    let id = req.params.id;
    Receipt.getReceiptByStoreID(id, (err, result) => {
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

  remove_receipt_by_id: (req, res) => {
    let id = req.params.id;
    Receipt.removeReceipt(id, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  }
};
