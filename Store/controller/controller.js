var Store = require("../model/model");

module.exports = {
  create_a_store: (req, res) => {
    var new_store = new Store(req.body);

    //handles null error
    if (!new_store.NID) {
      res.status(400).send({ error: true, message: "Please provide store" });
    } else {
      Store.createStore(new_store, (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.json(result);
        }
      });
    }
  },

  get_all_stores: (req, res) => {
    Store.getAllStores((err, result) => {
      if (err) res.send(err);
      console.log("res", result);
      res.send(result);
    });
  },

  get_store_by_id: (req, res) => {
    let id = req.params.id;
    Store.getStoreByID(id, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  },

  update_store_by_id: (req, res) => {
    let id = req.params.id;
    let store = req.body;
    Store.updateStoreById(id, store, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  },

  remove_store_by_id: (req, res) => {
    let id = req.params.id;
    Store.removeStore(id, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  }
};
