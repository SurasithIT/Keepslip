var request = require("request");
var fs = require("fs");
var soap = require("soap");

var url = `https://rdws.rd.go.th/serviceRD3/vatserviceRD3.asmx?wsdl`;

var specialRequest = request.defaults({
  agentOptions: {
    ca: fs.readFileSync("./model/adhq1.cer") //path of CA cert file
  }
});

var options = {
  request: specialRequest
};

module.exports = {
  soap,
  url,
  specialRequest,
  options
};
