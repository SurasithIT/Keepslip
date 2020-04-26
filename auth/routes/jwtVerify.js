const jwt = require("jsonwebtoken");
const jwtSecret = "KEEPSLIP_SECRET";

module.exports = {
  userVerify: (req, res, next) => {
    let authToken = req.headers.authorization;
    console.log(authToken);
    // console.log(req.headers.authorization.slice(4));
    // jwt.verify(req.cookies.KSa, jwtSecret, (error, result) => {
    jwt.verify(authToken, jwtSecret, (error, result) => {
      if (!error) {
        console.log(result);
        req.user = result;
        next();
      } else {
        console.log(error);
        //   res.send(error);
        res.status(401).send({ error: "Unauthorization!" });
      }
    });
  },

  storeVerify: (req, res, next) => {
    let authToken = req.headers.authorization;
    console.log(authToken);
    // jwt.verify(req.cookies.KSa, jwtSecret, (error, result) => {
    jwt.verify(authToken, jwtSecret, (error, result) => {
      if (!error) {
        if (result.role == "store") {
          console.log("this is store user");
          req.user = result;
          next();
        }
        if (result.role == "customer") {
          console.log("this is customer user");
          res.status(401).send({ error: "Unauthorization!" });
        }
        console.log(result);
      } else {
        console.log(error);
        //   res.send(error);
        res.status(401).send({ error: "Unauthorization!" });
      }
    });
  },

  customerVerify: (req, res, next) => {
    let authToken = req.headers.authorization;
    console.log(authToken);
    // jwt.verify(req.cookies.KSa, jwtSecret, (error, result) => {
    jwt.verify(authToken, jwtSecret, (error, result) => {
      if (!error) {
        if (result.role == "store") {
          console.log("this is store user");
          res.status(401).send({ error: "Unauthorization!" });
        }
        if (result.role == "customer") {
          console.log("this is customer user");
          req.user = result;
          next();
        }
        console.log(result);
      } else {
        console.log(error);
        //   res.send(error);
        res.status(401).send({ error: "Unauthorization!" });
      }
    });
  }
};
