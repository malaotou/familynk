var express = require('express');
var md5 = require('md5');
var apiRoutes = express.Router();
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var uuid = require('uuid/v4');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var photo = require('../domainModel/photo');
var util = require('../../utils/utils');
var config = require('../../utils/config');
var fileRepository = require('../domainRepository/fileRepository');
var moment = require('moment');
var userRepository = require('../domainRepository/userRepository');
var relation = require('../domainRepository/relationRepository');
var async = require('async');
var _ = require('lodash');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
/*
Get all first level related User
*/
app.get('/', function (req, res) {
  res.send('123')
})
app.post('/add', multipartMiddleware, function (req, res) {
  console.log('uploadfile');
  fileRepository.createFile(req)
    .then(file => {
      console.log(file,'file created successfully');
      // 创建文件信息。
      var fileinfo = Object.assign({}, {
        src: config.file.rooturl + file,
        date: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        uuid: req.body.uuid,
        images: [{
          src: config.file.rooturl + file
        }]
      }, req.body);
      fileRepository.savedbFileInfo(fileinfo).then(data => {
        if (data.sucess) {
          util.sendResponse(res, true, 'sucess', file);
        } else {
          util.sendResponse(res, false, data.message, null);
        }
      })
    })
    .catch(err => {
      console.log(err);
      util.sendResponse(res, false, err, null);
    })
});

app.post('/recentFile', function (req, res) {
  var uid = req.body.uid;
  if (uid) {
    fileRepository.getRecentPhotV2(uid).then(resData => {
      util.sendResponse(res, resData.sucess, resData.message, resData.data);
    })
  } else {
    util.sendResponse(res, resData.sucess, resData.message, resData.data)
  }
});

/*
 Get Specific File By userid
*/
app.post('', function (req, res) {

    photo.find({
        uid: req.body.uid //req.body.uid
      }).sort({
        date: -1
      })
      .then(data => {
        util.sendResponse(res, true, 'sucess', data);
      })
      .catch(err => {
        util.sendResponse(res, false, err, null);
      });
  }),
  app.post('/related', function (req, res) {
    if (req.body == null || req.body.uid == null || req.body.uid == "") {
      util.sendResponse(res, false, '参数uid 不能为空', null);
    }
    relation.getRelationUser({
      uid: req.body.uid
    }).then(
      data => {
        async.mapSeries(data.data, function (node, cb) {
          if (node.isLink) {
            cb(null, node.linkid)
          } else {
            cb(null, null)
          }
        }, function (err, result) {
          result.push(req.body.uid)
          //获取到唯一的关联用户ID
          util.sendResponse(res, true, 'sucess', _.uniq(result.filter(item => item != null)));
        })
      }
    )
  })

module.exports = app;