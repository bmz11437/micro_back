var http = require("http");

let httpRequest = {
  post(options, contents) {
    debugger;
    return new Promise((resolve, reject) => {
      var req = http.request(options, function (res) {
        res.setEncoding("utf8");
        res.on("data", function (data) {
          console.log("data:", data); //一段html代码
        });
        resolve(data);
      });
      req.on("error", function (e) {
        console.log("problem with request: " + e.message);
        reject();
      });
      req.write(contents);
      req.end;
    });
  },
};
module.exports = httpRequest;
