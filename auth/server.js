const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
port = process.env.PORT || 3005;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors());

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

const router = require("./routes/routes");

app.use("/api/auth", router);

app.listen(port, () => {
  console.log(`Auth service started on port ${port}`);
});
