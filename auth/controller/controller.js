var User = require("../model/model");

module.exports = {
  customer_login: (req, res) => {
    let customer = { ...req.body, role: "customer" };
    let user = new User(customer);
    User.customerLogin(user, (err, result) => {
      if (!err) {
        // user = {
        //   ...user,
        //   id: result.res[0].id,
        //   password: result.res[0].Password
        // };
        console.log(result);
        res.cookie("KSa", result.token).send(result);

        // console.log("Cookies: ", req.cookies);
        // console.log("Signed Cookies: ", req.signedCookies);
      } else {
        res.send(err);
      }
    });
  },

  store_login: (req, res) => {
    let store = { ...req.body, role: "store" };
    let user = new User(store);
    User.storeLogin(user, (err, result) => {
      if (!err) {
        // user = {
        //   ...user,
        //   id: result.res[0].id,
        //   password: result.res[0].Password
        // };
        res.cookie("KSa", result.token).send(result);

        // console.log("Cookies: ", req.cookies);
        // console.log("Signed Cookies: ", req.signedCookies);
      } else {
        res.send(err);
      }
    });
  },

  logout: (req, res) => {
    User.logout((err, result) => {
      res.clearCookie("KSa").send(result);
    });

    // console.log("Cookies: ", req.cookies);
    // console.log("Signed Cookies: ", req.signedCookies);
  }
};
