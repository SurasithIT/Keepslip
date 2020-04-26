const {
  address,
  contract,
  contractWithSigner
} = require("./SmartContract.config");

class Receipt {
  constructor(receipt) {
    this.receiptId = receipt.receiptId;
    this.receiptDate = receipt.receiptDate;
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
  constructor(receiptId, item) {
    this.receiptId = receiptId;
    this.productName = item.productName;
    this.price = item.price * 100; // thb * 100
    this.amount = item.amount;
    this.warranty = item.warranty;
    this.warrantyTime = item.warrantyTime; // day
  }
}

Receipt.recordReceipt = async (newReceipt, newItems, result) => {
  let receiptIds = await contract.getAllReceipt();

  if (receiptIds.indexOf(newReceipt[0]) !== -1) {
    let err = {
      error: true,
      status: 400,
      message: `Receipt ID ${newReceipt[0]} has been recorded!`
    };
    result(err, null);
    console.log(err);
  } else {
    contractWithSigner
      .recordReceipt(newReceipt, newItems)
      .then(res => {
        console.log("result", res);
        result(null, res);
      })
      .catch(err => {
        console.log("error: ", err);
        result(err, null);
      });
  }
};

Receipt.getReceipt = (receiptId, result) => {
  contract
    .getReceipt(receiptId)
    .then(res => {
      console.log("result", res);
      if (res[0] === "") {
        let err = {
          error: true,
          status: 400,
          message: `No data found of receipt id : ${receiptId}`
        };
        result(err, null);
      } else {
        let data = {
          receiptId: res[0],
          receiptDate: res[1]
        };
        result(null, data);
      }
    })
    .catch(err => {
      console.log("error: ", err);
      result(err, null);
    });
};

Receipt.getItem = (receiptId, itemNumber, result) => {
  contract
    .getItem(receiptId, itemNumber)
    .then(res => {
      console.log("result", res);
      if (res === []) {
        let err = {
          error: true,
          status: 400,
          message: `No data found of receipt id : ${receiptId}`
        };
        result(err, null);
      } else {
        let data = {
          receiptId: res[0],
          productName: res[1],
          price: res[2].toNumber() / 100,
          amount: res[3].toNumber(),
          warranty: res[4],
          warrantyTime: res[5].toNumber()
        };
        result(null, data);
      }
    })
    .catch(err => {
      console.log("error: ", err);
      result(err, null);
    });
};

Receipt.getAllItem = (receiptId, result) => {
  contract
    .getAllItem(receiptId)
    .then(res => {
      console.log("result", res);
      if (res.length === 0) {
        let err = {
          error: true,
          status: 400,
          message: `No data found of receipt id : ${receiptId}`
        };
        result(err, null);
      } else {
        let data = [];
        for (let i = 0; i < res.length; i++) {
          let item = {
            receiptId: res[i].receiptId,
            productName: res[i].productName,
            price: res[i].price.toNumber() / 100,
            amount: res[i].amount.toNumber(),
            warranty: res[i].warranty,
            warrantyTime: res[i].warrantyTime.toNumber()
          };
          data.push(item);
        }
        result(null, data);
      }
    })
    .catch(err => {
      console.log("error: ", err);
      result(err, null);
    });
};

Receipt.getAllReceipt = result => {
  contract
    .getAllReceipt()
    .then(res => {
      if (res.length === 0) {
        let err = {
          error: true,
          status: 400,
          message: `No data found`
        };
        result(err, null);
      } else {
        console.log("result", res);
        result(null, res);
      }
    })
    .catch(err => {
      console.log("error: ", err);
      result(err, null);
    });
};

Receipt.getFullReceipt = async (receiptId, result) => {
  let receipt = { receiptId: "", receiptDate: "", items: [] };
  contract
    .getReceipt(receiptId)
    .then(res => {
      // console.log("result", res);
      if (res[0] === "") {
        let err = {
          error: true,
          status: 400,
          message: `No data found of receipt id : ${receiptId}`
        };
        result(err, null);
      } else {
        receipt = {
          receiptId: res[0],
          receiptDate: res[1],
          items: []
        };
        // result(null, data);
        console.log(receipt);

        contract
          .getAllItem(receiptId)
          .then(res => {
            // console.log("result", res);
            let items = [];
            for (let i = 0; i < res.length; i++) {
              let item = {
                // receiptId: res[i].receiptId,
                productName: res[i].productName,
                price: res[i].price.toNumber() / 100,
                amount: res[i].amount.toNumber(),
                warranty: res[i].warranty,
                warrantyTime: res[i].warrantyTime.toNumber()
              };
              receipt.items.push(item);
            }
            console.log(receipt);
            result(null, receipt);
          })
          .catch(err => {
            console.log("error: ", err);
            result(err, null);
          });
      }
    })
    .catch(err => {
      console.log("error: ", err);
      result(err, null);
    });
};

module.exports = { Receipt, Items, Item };
