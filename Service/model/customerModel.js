const KeepSlipDB = require("./db.config");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class Customer {
  constructor(customer) {
    this.id = customer.id;
    this.username = customer.Username;
    this.password = customer.Password;
    this.firstname = customer.Firstname;
    this.lastname = customer.Lastname;
    this.phoneNumber = customer.PhoneNumber;
    this.email = customer.Email;
  }
}

Customer.createCustomer = async (newCustomer, result) => {
  let passwordHashed = await bcrypt.hash(newCustomer.password, saltRounds);
  let query = `INSERT INTO Customer VALUES (NULL, "${newCustomer.username}", "${passwordHashed}", "${newCustomer.firstname}", "${newCustomer.lastname}", "${newCustomer.phoneNumber}", "${newCustomer.email}");`;
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

Customer.getAllCustomers = result => {
  query = "SELECT * FROM Customer";
  KeepSlipDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("customers : ", res);
      result(null, res);
    }
  });
};

Customer.getCustomerByID = (customerId, result) => {
  let query = `SELECT * FROM Customer WHERE id=${customerId}`;
  KeepSlipDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("customer : ", res);
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

Customer.getCustomerByPhonenumber = (customerPhonenumber, result) => {
  let query = `SELECT * FROM Customer WHERE PhoneNumber=${customerPhonenumber}`;
  KeepSlipDB.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("customer : ", res);
      if (res.length == 0) {
        let err = {
          error: true,
          status: 400,
          message: `No data found of customer phone number ${customerPhonenumber}`
        };
        result(err, null);
      } else {
        result(null, res);
      }
    }
  });
};

Customer.updateCutomerById = async (id, customer, result) => {
  let {
    Username,
    Password,
    Firstname,
    Lastname,
    PhoneNumber,
    Email
  } = customer;
  let passwordHashed = await bcrypt.hash(Password, saltRounds);
  let query = `UPDATE Customer SET Username="${Username}", Password="${passwordHashed}", Firstname="${Firstname}", Lastname="${Lastname}", PhoneNumber="${PhoneNumber}", Email="${Email}"  WHERE id=${id}`;

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
          message: `No data match of customer id ${id}`
        };
        result(err, null);
      } else {
        result(null, res);
      }
    }
  });
};

Customer.removeCustomer = (id, result) => {
  let query = `DELETE FROM Customer WHERE id = ${id}`;
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
          message: `No data match of customer id ${id}`
        };
        result(err, null);
      } else {
        result(null, res);
      }
    }
  });
};

module.exports = Customer;
