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
var albumlog = require('../domainRepository/albumreadlogRepository');
var async = require('async');
var _ = require('lodash');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
/*
Get all first level related User
*/
app.post('/add', multipartMiddleware, function (req, res) {
  fileRepository.createFile(req)
    .then(file => {

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
app.post('/addavatar', multipartMiddleware, function (req, res) {
  fileRepository.createFile(req)
    .then(file => {
      util.sendResponse(res, true, 'sucess', config.file.rooturl + file);
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
app.post('/uuid', function (req, res) {
  console.log(uuid())
  util.sendResponse(res, true, 'sucess', uuid())
})
/*
 Get Specific File By userid
*/
app.post('', function (req, res) {

    photo.find({
        uuid: req.body.uuid //req.body.uid
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
  app.post('/allrelate', function (req, res) {
    photo.find({
        uuid: {
          $in: req.body.uuids
        } //req.body.uid
      }).sort({
        date: -1
      })
      .then(data => {
        async.mapSeries(data.data, function (node, cb) {
          userRepository.getuserById(node.uuid)
            .then(user => {
              console.log(user,'user')
              cb(Object.assign({}, node, {
                avatarUrl: user.avatarUrl,
                name: user.name
              }))
            })
        }, function (err, relults) {
          console.log(relults);
          util.sendResponse(res, true, 'sucess', relults);
        })


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

app.get('/test', function (req, res) {
  albumlog.createHis({
    uuid: '////',
    albumid: '\\\\',
  }).then(data => {
    console.log(data);
  })
})
app.post('/readlogCreate', function (req, res) {
  fileRepository.getRecentPhotV2(req.body.uuid)
    .then(data => {
      if (data.data.length > 0) {
        albumlog.createHis({
          uuid: req.body.uuid,
          albumuuid: data.data[0].albumuuid
        }).then(data2 => {
          console.log(data2)
        })
      } else {

      }
      util.sendResponse(res, true, 'sucess', null);
    })
})

module.exports = app;