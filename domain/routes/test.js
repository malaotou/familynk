var express = require('express');
var md5 = require('md5');
var apiRoutes = express.Router();
var app = express();
var bodyParser = require('body-parser');
var crypto = require('crypto');
app.use(bodyParser.json());
/*
Get all first level related User
*/
app.get('', function (req, res) {
    const secret = 'abcdefg';
    const hash = crypto.createHmac('sha256', secret)
        .update('I love cupcakes')
        .digest('hex');
    res.send(hash);
});


module.exports = app;