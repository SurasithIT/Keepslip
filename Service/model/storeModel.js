const KeepSlipDB = require("./db.config");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class Store {
  constructor(store) {
    this.id = store.id;
    this.NID = store.NID;
    this.businessName = store.BusinessName;
    this.branch_id = store.Branch_id;
    this.storeName = store.StoreName;
    this.address = store.Address;
    this.postcode = store.PostCode;
    this.username = store.Username;
    this.password = store.Password;
  }
}

Store.createStore = async (newStore, result) => {
  let passwordHashed = await bcrypt.hash(newStore.password, saltRounds);
  let query = `INSERT INTO Store VALUES (NULL, "${newStore.NID}", "${newStore.businessName}", "${newStore.branch_id}", "${newStore.storeName}", "${newStore.address}", "${newStore.postcode}", "${newStore.username}", "${passwordHashed}");`;
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

Store.getAllStores = result => {
  query = "SELECT * FROM Store";
  KeepSlipDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("stores : ", res);
      result(null, res);
    }
  });
};

Store.getStoreByID = (storeId, result) => {
  let query = `SELECT * FROM Store WHERE id=${storeId}`;
  KeepSlipDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("store : ", res);
      if (res.length === 0) {
        let err = {
          error: true,
          status: 400,
          message: `No data found of store id : ${storeId}`
        };
        result(err, null);
      } else {
        result(null, res);
      }
    }
  });
};

Store.updateStoreById = async (id, store, result) => {
  let {
    NID,
    BusinessName,
    Branch_id,
    StoreName,
    Address,
    PostCode,
    Username,
    Password
  } = store;
  let passwordHashed = await bcrypt.hash(Password, saltRounds);
  let query = `UPDATE Store SET NID="${NID}", BusinessName="${BusinessName}", Branch_id="${Branch_id}", StoreName="${StoreName}", Address="${Address}", PostCode="${PostCode}", Username="${Username}",Password="${passwordHashed}"  WHERE id=${id}`;

  KeepSlipDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res);
      result(null, res);
    }
  });
};

Store.removeStore = (id, result) => {
  let query = `DELETE FROM Store WHERE id = ${id}`;
  KeepSlipDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res);
      result(null, res);
    }
  });
};

module.exports = Store;
