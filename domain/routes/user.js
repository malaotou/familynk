    var express = require('express');
    var md5 = require('md5');
    var apiRoutes = express.Router();
    var app = express();
    var bodyParser = require('body-parser');

    var user = require('../domainModel/user');
    var util = require('../../utils/utils');
    var userRepository = require('../domainRepository/userRepository');
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
    /*
    Get all User
    */
    app.get('', function (req, res) {

    });
    /*
    身份檢測認證，是否已經登記在系統中
    */
    app.post('/auth', function (req, res) {
      var uid = req.body.uid;
      userRepository.getUserbyWeChatId({
          uid: uid
        })
        .then(data => {
          util.sendResponse(res, data.sucess, data.message, data.data);
        })
        .catch(err => {
          util.sendResponse(res, false, err, null);
          console.log(err);
        })
    })

    /*
     Create User Info
    */
    app.post('/add', function (req, res) {
      if (req.body != null) {
        userRepository.createNewUser(req.body)
          .then(data => {
            util.sendResponse(res, true, 'sucess', data);
          })
          .catch(err => {
            util.sendResponse(res, false, err, null);
          });
      }
    });

    app.get('/relate', function (req, res) {

    })
    /*
     Update User Info
     */
    app.post('/update', function (req, res) {
      if (req.body) {
        userRepository.updateUserInfo(req.body)
          .then(data => {
            util.sendResponse(res, data.response, data.message, data.data);
          })
          .catch(err => {
            util.sendResponse(res, err.sucess, err.message, err.data);
          })
      } else {
        util.sendResponse(res, 'error', 'parameter is null', null);
      }

    })
    module.exports = app;