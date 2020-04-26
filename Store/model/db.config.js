const mysql = require("mysql");

var KeepSlipDB = mysql.createConnection({
  host: process.env.MYSQL_HOST || "localhost",
  port: process.env.MYSQL_PORT || "3307",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "1234",
  database: process.env.MYSQL_DATABASE || "KeepSlipDB"
  // insecureAuth: "true"
});

KeepSlipDB.connect((err, res) => {
  if (err) throw err;
  else console.log("KeepSlip database connected!");
});

module.exports = KeepSlipDB;
