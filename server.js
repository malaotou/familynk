'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var busboy = require('connect-busboy');
app.use(bodyParser({
  uploadDir: './tmp'
}))
app.use(bodyParser.json());
var path = require('path');

var routes = require('./domain');
let http = require('http').Server(app);
let https = require('https');
var path = require('path');
var fs = require('fs');

var options = {
  key: fs.readFileSync(__dirname + '/certs/214518924240909.key'),
  cert: fs.readFileSync(__dirname + '/certs/214518924240909.pem')
}

//var config = require('./utils/config').api;
var config = require('./utils/config').api


// set DB
var mongose = require('./domain/mongose');
// App root directory
global.appRoot = path.resolve(__dirname);
app.use(express.json({
  limit: '50mb'
}));
//app.use('/file', express.static("C:\\family\\"));
app.use('/file', express.static(config.path));


app.get('/', function (req, res) {
  res.send('123')
})
app.post('', multipartMiddleware, function (req, res) {
  console.log(req);
  console.log(req.files);
  res.send('req')
})
routes(app);
var server = http.listen(config.port, config.host, function () {
  var host = config.host
  var port = config.port
  console.log("Example app listening at http://%s:%s", host, port)
});
var httpsServer = https.createServer(options, app);
httpsServer.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
httpsServer.listen(443);