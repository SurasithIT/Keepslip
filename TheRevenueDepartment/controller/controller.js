var StoreRequest = require("../model/model");

module.exports = {
  get_store: (req, res) => {
    var new_store = new StoreRequest(req.body);
    StoreRequest.getStoreData(new_store, async (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  }
};
