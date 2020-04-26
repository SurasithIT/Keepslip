var { Receipt, Items, Item } = require("../model/model");

module.exports = {
  record_a_receipt: (req, res) => {
    var new_receipt = new Receipt(req.body);
    // var new_items = [];
    var new_items = new Items();
    for (let i = 0; i < req.body.items.length; i++) {
      var new_item = new Item(req.body.receiptId, req.body.items[i]);
      new_items.items.push(new_item);
    }

    let receipt = Object.values(new_receipt);
    let items = [];
    for (let i = 0; i < new_items.items.length; i++) {
      items.push(Object.values(new_items.items[i]));
    }

    if (!new_receipt.receiptId) {
      res.status(400).send({ error: true, message: "Please provide receipt" });
    } else {
      Receipt.recordReceipt(receipt, items, (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.json(result);
        }
      });
    }
  },

  get_receipt: (req, res) => {
    let receiptId = req.params.id;
    Receipt.getReceipt(receiptId, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result[0] === "") {
          res.status(400).send({
            error: true,
            message: `No data found of receipt id : ${receiptId}`
          });
        } else {
          res.send(result);
        }
      }
    });
  },

  get_item: (req, res) => {
    let receiptId = req.params.id;
    let itemNumber = req.params.itemNumber - 1;
    Receipt.getItem(receiptId, itemNumber, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  },

  get_all_item: (req, res) => {
    let receiptId = req.params.id;
    Receipt.getAllItem(receiptId, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  },

  get_all_receiptId: (req, res) => {
    Receipt.getAllReceipt((err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result[0] === "") {
          res.status(400).send({
            error: true,
            message: `No data found`
          });
        } else {
          res.send(result);
        }
      }
    });
  },

  get_full_receipt: (req, res) => {
    let receiptId = req.params.id;
    Receipt.getFullReceipt(receiptId, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result[0] === "") {
          res.status(400).send({
            error: true,
            message: `No data found`
          });
        } else {
          res.send(result);
        }
      }
    });
  }
};
