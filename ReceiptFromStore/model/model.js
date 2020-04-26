const ReceiptDB = require("./db.config");

class Receipt {
  constructor(receipt) {
    this.receiptId = receipt.receiptId;
    this.receiptDate = receipt.receiptDate;
    this.storeId = receipt.storeId;
    // this.items = receipt.items;
  }
}

class Items {
  constructor() {
    this.items = [];
  }
  add(item) {
    this.items.push(item);
  }
}

class Item {
  constructor(receiptId, store_id, index, item) {
    this.itemNumber = `${receiptId}-${index + 1}`;
    this.productName = item.productName;
    this.price = item.price;
    this.amount = item.amount;
    this.warranty = item.warranty;
    this.warrantyTime = item.warrantyTime; // day
    this.receipt_id = receiptId;
    this.receipt_store_id = store_id;
  }
}
Receipt.createReceipt = (newReceipt, newItems, result) => {
  let queryReceipt = `INSERT INTO Receipt VALUES ("${newReceipt.receiptId}", "${newReceipt.receiptDate}", ${newReceipt.storeId});`;
  ReceiptDB.query(queryReceipt, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    } else {
      console.log("insertId", res.insertId);

      // insert Item table
      for (let i = 0; i < newItems.items.length; i++) {
        let warranty;
        if (newItems.items[i].warranty == true) {
          warranty = 1;
        } else {
          warranty = 0;
        }
        let queryItem = `INSERT INTO Item VALUES ("${newItems.items[i].itemNumber}", "${newItems.items[i].productName}", ${newItems.items[i].price}, ${newItems.items[i].amount}, ${warranty}, ${newItems.items[i].warrantyTime}, "${newItems.items[i].receipt_id}", ${newItems.items[i].receipt_store_id});`;
        ReceiptDB.query(queryItem, (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
          } else {
            console.log("insertId", res.insertId);
            // result(null, res);
          }
        });
      }
      result(null, res);
    }
  });
};

Receipt.getAllReceipts = result => {
  query = "SELECT * FROM Receipt";
  ReceiptDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("receipts : ", res);
      result(null, res);
    }
  });
};

Receipt.getAllItems = result => {
  query = "SELECT * FROM Item";
  ReceiptDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("items : ", res);
      result(null, res);
    }
  });
};

Receipt.getReceiptByID = (receiptId, storeId, result) => {
  let query = `SELECT * FROM Receipt WHERE id="${receiptId}" AND Store_id=${storeId}`;
  ReceiptDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("receipt : ", res);
      if (res.length == 0) {
        let err = {
          error: true,
          status: 400,
          message: `No data found of receipt id ${receiptId} and store id ${storeId}`
        };
        result(err, null);
      } else {
        result(null, res);
      }
    }
  });
};

Receipt.getItemByID = (receiptId, storeId, result) => {
  let query = `SELECT * FROM Item WHERE Receipt_id="${receiptId}" AND Receipt_Store_id=${storeId}`;
  ReceiptDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("receipt : ", res);
      if (res.length == 0) {
        let err = {
          error: true,
          status: 400,
          message: `No data found of receipt id ${receiptId} and store id ${storeId}`
        };
        result(err, null);
      } else {
        result(null, res);
      }
    }
  });
};

Receipt.getFullReceiptByID = (receiptId, storeId, result) => {
  let queryReceipt = `SELECT * FROM Receipt WHERE id = "${receiptId}" AND Store_id = ${storeId}`;
  let queryItem = `SELECT * FROM Item WHERE Receipt_id="${receiptId}" AND Receipt_Store_id=${storeId};`;
  let data = { id: "", ReceiptDate: "", Store_id: "", items: [] };
  ReceiptDB.query(queryReceipt, (err, res) => {
    console.log(res);
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length == 0) {
      let err = {
        error: true,
        status: 400,
        message: `No data found of receipt id ${receiptId} and store id ${storeId}`
      };
      result(err, null);
    } else {
      // result(null, res);
      data.id = res[0].id;
      data.ReceiptDate = res[0].ReceiptDate;
      data.Store_id = res[0].Store_id;
      console.log(data);

      ReceiptDB.query(queryItem, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
        } else {
          console.log(res.length);
          for (let i = 0; i < res.length; i++) {
            data.items.push(res[i]);
          }
          result(null, data);
        }
      });
    }
  });
};

// Receipt.updateReceiptById = (id, receipt, result) => {
//   // let { receiptDate, store_id, items } = receipt;
//   // let queryReceipt = `UPDATE Receipt SET id="${id}", receiptDate="${receiptDate}", store_id="${store_id}", Lastname="${Lastname}", PhoneNumber="${PhoneNumber}", Email="${Email}"  WHERE id="${id}"`;
//   // let queryItem = `UPDATE Receipt SET id="${id}", receiptDate="${receiptDate}", store_id="${store_id}", Lastname="${Lastname}", PhoneNumber="${PhoneNumber}", Email="${Email}"  WHERE id="${id}"`;

//   // ReceiptDB.query(query, (err, res) => {
//   //   if (err) {
//   //     console.log("error: ", err);
//   //     result(err, null);
//   //   } else {
//   //     console.log(res);
//   //     result(null, res);
//   //   }
//   // });
//   let queryReceipt = `UPDATE Receipt SET id="${id}", receiptDate="${receiptDate}", store_id="${store_id}", Lastname="${Lastname}", PhoneNumber="${PhoneNumber}", Email="${Email}"  WHERE id="${id}"`;
//   let queryItem = `UPDATE Receipt SET id="${id}", receiptDate="${receiptDate}", store_id="${store_id}", Lastname="${Lastname}", PhoneNumber="${PhoneNumber}", Email="${Email}"  WHERE id="${id}"`;
//   ReceiptDB.query(queryReceipt, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     } else {
//       console.log("insertId", res.insertId);

//       // insert Item table
//       for (let i = 0; i < newItems.items.length; i++) {
//         let warranty;
//         if (newItems.items[i].warranty == true) {
//           warranty = 1;
//         } else {
//           warranty = 0;
//         }
//         let queryItem = `INSERT INTO Item VALUES ("${newItems.items[i].itemNumber}", "${newItems.items[i].productName}", ${newItems.items[i].price}, ${newItems.items[i].amount}, ${warranty}, ${newItems.items[i].warrantyTime}, "${newItems.items[i].receipt_id}", "${newItems.items[i].receipt_store_id}");`;
//         ReceiptDB.query(queryItem, (err, res) => {
//           if (err) {
//             console.log("error: ", err);
//             result(err, null);
//           } else {
//             console.log("insertId", res.insertId);
//             // result(null, res);
//           }
//         });
//       }
//       result(null, res);
//     }
//   });
// };

Receipt.removeItem = (receiptId, storeId, result) => {
  let queryReceipt = `DELETE FROM Receipt WHERE id = ${receiptId} AND Store_id = ${storeId}`;
  let queryItem = `DELETE FROM Item WHERE Receipt_id=${receiptId} AND Receipt_Store_id=${storeId};`;
  ReceiptDB.query(queryItem, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    } else {
      console.log(res);
      // result(null, res);

      ReceiptDB.query(queryReceipt, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
        } else {
          console.log(res);
          result(null, res);
        }
      });
    }
  });
};
module.exports = { Receipt, Item, Items };
