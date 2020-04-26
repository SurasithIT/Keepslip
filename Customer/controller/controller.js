var Customer = require("../model/model");

module.exports = {
  create_a_customer: (req, res) => {
    var new_customer = new Customer(req.body);

    //handles null error
    if (!new_customer.username) {
      res.status(400).send({ error: true, message: "Please provide customer" });
    } else {
      Customer.createCustomer(new_customer, (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.json(result);
        }
      });
    }
  },

  get_all_customers: (req, res) => {
    Customer.getAllCustomers((err, result) => {
      if (err) res.send(err);
      console.log("res", result);
      res.send(result);
    });
  },

  get_customer_by_phonenumber: (req, res) => {
    let phoneNumber = req.params.phoneNumber;
    Customer.getCustomerByPhonenumber(phoneNumber, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  },

  get_customer_by_id: (req, res) => {
    let id = req.params.id;
    Customer.getCustomerByID(id, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  },

  update_customer_by_id: (req, res) => {
    let id = req.params.id;
    let customer = req.body;
    Customer.updateCutomerById(id, customer, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  },

  remove_customer_by_id: (req, res) => {
    let id = req.params.id;
    Customer.removeCustomer(id, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  }
};
