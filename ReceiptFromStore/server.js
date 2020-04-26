const express = require("express");
const app = express();
const bodyParser = require("body-parser");
port = process.env.PORT || 3006;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors());
// var router = require("./routes/routes"); //importing route
const router = require("./routes/routes");
// routes(app); //register the route

app.use("/api/receiptFromStore", router);

app.listen(port, () => {
  console.log(`Receipt-from-Store service started on port ${port}`);
});
