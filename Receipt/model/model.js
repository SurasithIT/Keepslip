const KeepSlipDB = require("./db.config");

class Receipt {
  constructor(receipt) {
    this.cutomerId = receipt.Customer_id;
    this.storeId = receipt.Store_id;
    this.receiptId = receipt.Receipt_id;
    this.KeepSlipReceiptId = `S${receipt.Store_id}I${receipt.Receipt_id}`;
    this.receiptDate = receipt.Receipt_date;
    // this.KeepSlipReceiptId = `S${receipt.Store_id}R${receipt.Receipt_id}`
  }
}

Receipt.createReceipt = (newReceipt, result) => {
  let query = `INSERT INTO Receipt VALUES (${newReceipt.cutomerId}, ${newReceipt.storeId}, "${newReceipt.receiptId}", "${newReceipt.KeepSlipReceiptId}", "${newReceipt.receiptDate}");`;
  KeepSlipDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("insertId", res.insertId);
      result(null, res);
    }
  });
};

Receipt.getAllReceipts = result => {
  let select = `Receipt.Customer_id, Receipt.Store_id,Receipt.Receipt_id,Receipt.KeepSlip_receipt_id,Receipt.Receipt_date, Customer.Firstname, Customer.Lastname, Customer.PhoneNumber, Customer.Email, Store.NID, Store.Branch_id, Store.StoreName, Store.BusinessName, Store.Address, Store.PostCode`;
  query = `SELECT ${select} FROM Receipt INNER JOIN Customer ON Receipt.Customer_id=Customer.id INNER JOIN Store ON Receipt.Store_id = Store.id`;
  KeepSlipDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("receipts : ", res);
      result(null, res);
    }
  });
};

Receipt.getReceiptByID = (receiptId, result) => {
  let select = `Receipt.Customer_id, Receipt.Store_id,Receipt.Receipt_id,Receipt.KeepSlip_receipt_id,Receipt.Receipt_date, Customer.Firstname, Customer.Lastname, Customer.PhoneNumber, Customer.Email, Store.NID, Store.Branch_id, Store.StoreName, Store.BusinessName, Store.Address, Store.PostCode`;
  let query = `SELECT ${select} FROM Receipt INNER JOIN Customer ON Receipt.Customer_id=Customer.id INNER JOIN Store ON Receipt.Store_id = Store.id WHERE  Receipt.KeepSlip_receipt_id="${receiptId}"`;
  KeepSlipDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("receipt : ", res);
      if (res.length == 0) {
        let err = {
          error: true,
          status: 400,
          message: `No data found of receipt id ${receiptId}`
        };
        result(err, null);
      } else {
        result(null, res);
      }
    }
  });
};

Receipt.getReceiptByCustomerID = (customerId, result) => {
  let select = `Receipt.Customer_id, Receipt.Store_id,Receipt.Receipt_id,Receipt.KeepSlip_receipt_id,Receipt.Receipt_date, Customer.Firstname, Customer.Lastname, Customer.PhoneNumber, Customer.Email, Store.NID, Store.Branch_id, Store.StoreName, Store.BusinessName, Store.Address, Store.PostCode`;
  let query = `SELECT ${select} FROM Receipt INNER JOIN Customer ON Receipt.Customer_id=Customer.id INNER JOIN Store ON Receipt.Store_id = Store.id WHERE Receipt.Customer_id=${customerId}`;
  KeepSlipDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("receipt : ", res);
      if (res.length == 0) {
        let err = {
          error: true,
          status: 400,
          message: `No data found of customer id ${customerId}`
        };
        result(err, null);
      } else {
        result(null, res);
      }
    }
  });
};

Receipt.getReceiptByStoreID = (storeId, result) => {
  let select = `Receipt.Customer_id, Receipt.Store_id,Receipt.Receipt_id,Receipt.KeepSlip_receipt_id,Receipt.Receipt_date, Customer.Firstname, Customer.Lastname, Customer.PhoneNumber, Customer.Email, Store.NID, Store.Branch_id, Store.StoreName, Store.BusinessName, Store.Address, Store.PostCode`;
  let query = `SELECT ${select} FROM Receipt INNER JOIN Customer ON Receipt.Customer_id=Customer.id INNER JOIN Store ON Receipt.Store_id = Store.id WHERE Receipt.Store_id=${storeId}`;
  KeepSlipDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("receipt : ", res);
      if (res.length == 0) {
        let err = {
          error: true,
          status: 400,
          message: `No data found of store id ${storeId}`
        };
        result(err, null);
      } else {
        result(null, res);
      }
    }
  });
};
// Receipt.updateReceiptById = (receiptId, receipt, result) => {
//   let { Store_id, Receipt_id } = receipt;
//   let KeepSlip_receipt_id = `S${Store_id}I${Receipt_id}`;
//   let query = `UPDATE Receipt SET Receipt_id="${Receipt_id}", KeepSlip_receipt_id="${KeepSlip_receipt_id}" WHERE KeepSLip_receipt_id="${receiptId}"`;

//   KeepSlipDB.query(query, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//     } else {
//       console.log(res);
//       result(null, res);
//     }
//   });
// };

Receipt.removeReceipt = (receiptId, result) => {
  let query = `DELETE FROM Receipt WHERE KeepSLip_receipt_id = "${receiptId}"`;
  KeepSlipDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res);
      if (res.affectedRows == 0) {
        let err = {
          error: true,
          status: 400,
          message: `No data match of receipt id ${receiptId}`
        };
        result(err, null);
      } else {
        result(null, res);
      }
    }
  });
};
module.exports = Receipt;
