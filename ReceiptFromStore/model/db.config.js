const mysql = require("mysql");

var ReceiptDB = mysql.createConnection({
  host: process.env.MYSQL_HOST || "localhost",
  port: process.env.MYSQL_PORT || "3307",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "1234",
  database: process.env.MYSQL_DATABASE || "ReceiptDB",
  // socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
  // insecureAuth: "true"
});

ReceiptDB.connect((err, res) => {
  if (err) throw err;
  else console.log("Receipt database connected!");
});

module.exports = ReceiptDB;
