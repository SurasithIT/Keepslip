const KeepSlipDB = require("./db.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = "KEEPSLIP_SECRET";
const jwtVerify = require("../routes/jwtVerify");

class User {
  constructor(user) {
    this.id = user.id;
    this.username = user.username;
    this.password = user.password;
    this.role = user.role;
    this.remember = user.remember;
  }
}

User.customerLogin = (user, result) => {
  let query = `SELECT * FROM Customer WHERE Customer.Username="${user.username}"`;

  KeepSlipDB.query(query, async (err, res) => {
    // result(null, res);
    console.log(res);
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      // console.log("customer : ", res);
      if (res.length == 0) {
        let err = {
          error: true,
          status: 400,
          message: `No data found of customer ${user.username}`,
        };
        result(err, null);
        console.log("error: ", err);
      } else {
        let pass = await bcrypt.compare(user.password, res[0].Password);
        // console.log(pass);
        if (pass) {
          console.log("user.remember", user.remember);
          if (user.remember) {
            var token = jwt.sign(
              {
                user_id: res[0].id,
                username: res[0].Username,
                role: "customer",
              },
              jwtSecret
            );
            result(null, { token: token });
            console.log("Token set!", token);
          } else {
            var token = jwt.sign(
              {
                user_id: res[0].id,
                username: res[0].Username,
                role: "customer",
              },
              jwtSecret,
              {
                expiresIn: "30m",
              }
            );
            result(null, { token: token });
            console.log("Token set!", token);
          }

          // res.cookie("token", token).send("cookie set");
        } else {
          let err = {
            error: true,
            status: 401,
            message: `Wrong password!`,
          };
          result(err, null);
          console.log("error: ", err);
          // res.send("Wrong password!");
        }
        // result(null, res);
      }
    }
  });
};

User.storeLogin = (user, result) => {
  let query = `SELECT * FROM Store WHERE Store.Username="${user.username}"`;

  KeepSlipDB.query(query, async (err, res) => {
    // result(null, res);
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      // console.log("customer : ", res);
      if (res.length == 0) {
        let err = {
          error: true,
          status: 400,
          message: `No data found of store ${user.username}`,
        };
        result(err, null);
      } else {
        let pass = await bcrypt.compare(user.password, res[0].Password);
        // console.log(pass);
        if (pass) {
          // console.log(res);
          var token = jwt.sign(
            { user_id: res[0].id, username: res[0].Username, role: "store" },
            jwtSecret
          );
          result(null, { token: token });
          console.log("Token set!", token);
          // res.cookie("token", token).send("cookie set");
        } else {
          let err = {
            error: true,
            status: 401,
            message: `Wrong password!`,
          };
          result(err, null);
          console.log("error: ", err);
          // res.send("Wrong password!");
        }
        // result(null, res);
      }
    }
  });
};

User.logout = (result) => {
  let res = { status: "Token cookie cleared!" };
  result(null, res);
};

module.exports = User;
