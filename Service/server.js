const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
port = process.env.PORT || 3001;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors());

const router = require("./routes/routes");

app.use("/api/keepslip", router);

app.listen(port, () => {
  console.log(`KeepSlip service started on port ${port}`);
});
