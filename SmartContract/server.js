const express = require("express");
const app = express();
const bodyParser = require("body-parser");
port = process.env.PORT || 3002;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors());

const router = require("./routes/routes");

app.use("/api/smartcontract", router);

app.listen(port, () => {
  console.log(`Smart Contract service started on port ${port}`);
});
