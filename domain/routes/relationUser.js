var express = require('express');
var md5 = require('md5');
var apiRoutes = express.Router();
var app = express();
var bodyParser = require('body-parser');
var uuid = require('uuid/v4');
var user = require('../domainModel/user');
var relation = require('../domainModel/relateionUser');
var relationRepository = require('../domainRepository/relationRepository');
var userRepository = require('../domainRepository/userRepository');
var fileRepository = require('../domainRepository/fileRepository');
var readLogRepository = require('../domainRepository/albumreadlogRepository');
var util = require('../../utils/utils');
var moment = require('moment');
var async = require('async');
var _ = require('lodash');
/*
Get all first level related User
*/
// app.get('', function (req, res) {
//   var u = {
//     weid: 123, // RelatedId,
//     uid: 123,
//     relation: 'String',
//     relationId: 'String', // id_id_id_id
//   }
//   var relationUser = new relation(u);
//   relationUser.save().then(() => console.log('meow'));

//   relation.find(null).then(data => {
//     console.log(data);
//     res.send({
//       data
//     });
//     res.end();
//   });
// });

/*
 Get Specific User By User Id
 两种获取方式，一种关系未认证，获取自己录入的数据
              第二种已认证关系，获取用户自己信息
*/
app.post('/relation', function (req, res) {

  if (req.body != null) {
    var uid = req.body.uid;
    var uuid = req.body.uuid;
    var userinfo = {
      uid: uid,
      uuid: uuid
    }
    // 获取关联用户信息，从relationUser 表
    relationRepository.getRelationUser(userinfo).then(data => {
      var rtn = [];
      async.mapSeries(data.data, function (node, cb) {
        if (node.isLink && node.linkid && node.linkid.length >= 0) {
          getRelationData(node).then(linkData => {
            cb(null, {
              name: linkData.name,
              relation: node.relation,
              birth: linkData.birth,
              address: linkData.address,
              nationality: linkData.nationality,
              isLink: node.isLink,
              linkid: node.linkid,
              birthyear: linkData.birthyear,
              date: linkData.date,
              uuidlink: node.uuidlink
            });
          })
        } else {
          cb(null, {
            name: node.name,
            relation: node.relation,
            birth: node.birthday,
            address: node.address,
            nationality: node.nationality,
            isLink: node.isLink,
            linkid: node.linkid,
            birthyear: node.birthyear,
            date: node.date,
            uuidlink: node.uuidlink
          });
        }

      }, function (err, results) {
        util.sendResponse(res, data.sucess, data.message, _.sortBy(results, 'date'));
      });

    })
  } else {
    util.sendResponse(res, false, '参数不能为空', null);
  }
})
app.post('/relationV2', function (req, res) {

  if (req.body != null) {
    var uid = req.body.uid;
    var uuid = req.body.uuid;
    var userinfo = {
      uid: uid,
      uuid: uuid
    }
    // 获取关联用户信息，从relationUser 表
    relationRepository.getRelationUser(userinfo).then(data => {
      var rtn = [];
      async.mapSeries(data.data, function (node, cb) {
        getRelationDataV2(node).then(linkData => {
          fileRepository.getRecentPhotV2(node.linkid)
            .then(photo => {
              if (photo.data.length > 0) { // 存在最新文件
                readLogRepository.getHis({
                  uuid: node.linkid,
                  albumuuid: photo.data[0].albumuuid
                }).then(data2 => {
                  console.log(data2);
                  if (data2 == null) { // 未查看相关信息，读取图片信息
                    cb(null, {
                      name: linkData.name,
                      relation: node.relation,
                      birth: linkData.birth,
                      address: linkData.address,
                      nationality: linkData.nationality,
                      isLink: node.isLink,
                      linkid: node.linkid,
                      birthyear: linkData.birthyear,
                      date: linkData.date,
                      uuidlink: node.uuidlink,
                      avatarUrl: linkData.avatarUrl,
                      recent: photo.data[0].images[0].src
                    });
                  } else {
                    cb(null, {
                      name: linkData.name,
                      relation: node.relation,
                      birth: linkData.birth,
                      address: linkData.address,
                      nationality: linkData.nationality,
                      isLink: node.isLink,
                      linkid: node.linkid,
                      birthyear: linkData.birthyear,
                      date: linkData.date,
                      uuidlink: node.uuidlink,
                      avatarUrl: linkData.avatarUrl,
                      recent: ''
                    });
                  }
                })
              } else { // 不存在最新文件
                cb(null, {
                  name: linkData.name,
                  relation: node.relation,
                  birth: linkData.birth,
                  address: linkData.address,
                  nationality: linkData.nationality,
                  isLink: node.isLink,
                  linkid: node.linkid,
                  birthyear: linkData.birthyear,
                  date: linkData.date,
                  uuidlink: node.uuidlink,
                  avatarUrl: linkData.avatarUrl,
                  recent: ''
                });
              }

            })
        })
      }, function (err, results) {
        util.sendResponse(res, data.sucess, data.message, _.sortBy(results, 'date'));
      });
    })
  } else {
    util.sendResponse(res, false, '参数不能为空', null);
  }
})
/*
  保存对应的人员关系，及邀请人的信息,这里不产生关联关系。
*/
app.post('/add', function (req, res) {
  var tmpuuid = uuid();
  // 处理邀请用户信息
  const weid = uuid();
  var relationInfo = Object.assign({}, req.body.relationUserinfo, {
    date: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
    linkid: tmpuuid,
    creator: req.body.relationUserinfo.uuidlink
  });
  relationRepository.addRelation(relationInfo) // 创建关系
    .then(data => {
      // Create Tmp User
      userRepository.createNewUser({
        weid: weid,
        avatarUrl: relationInfo.avatarUrl,
        gender: relationInfo.gender,
        address: relationInfo.address,
        nationality: relationInfo.nationality,
        birth: relationInfo.birth,
        birthyear: relationInfo.birthyear,
        uid: '',
        uuid: tmpuuid,
        name: relationInfo.name,
        creator: req.body.relationUserinfo.uuidlink
      })
      util.sendResponse(res, data.sucess, data.message, data.data);
    }).catch(err => {
      util.sendResponse(res, false, err, null);
    })
});
/*
Update related user
*/
app.post('/delete', function (req, res) {
  if (req.body != null && req.body.id != null) {

  }
});


/*
  受邀请方确认邀请的关系，在受邀请方，确认是，确认邀请方发送的关系，并创建反向的对应关系。
  操作：1、 confirm 当前的relation
       2、创建当前的relation
*/

app.post('/confirm', function (req, res) {
  console.log(req.body);
  if (req.body.relation != null && req.body.currentuser != null && req.body.relationuser != null) {

    relationRepository.confirmRelation({
        id: req.body.relation.id
      }, {
        linkid: req.body.uid
      })
      .then(data => {
        if (data.sucess) {
          util.getNewReltion(req.body.relationuser.gender, req.body.relation.relationid)
            .then(newrel => {
              relationRepository.addRelation({
                  uid: req.body.uid,
                  relation: newrel.relation,
                  relationId: newrel.relationId,
                  isLink: true,
                  linkid: req.body.relation.uid
                })
                .then(data => {
                  util.sendResponse(res, true, 'sucess', data)
                })
                .catch(err => {
                  util.sendResponse(res, false, err, null)
                })
            });
        } else {
          util.sendResponse(res, false, '已经被认领', null)
        }
      })
  }
  util.sendResponse(res, null, null, null);
})
app.post('/getdetail', function (req, res) {
  console.log('get detail')
  var relationid = req.body.id;
  if (relationid == null || relationid == '') {
    util.sendResponse(res, false, '参数不能为空,参数 relation id', null)
  } else {
    relationRepository.getrelationbyid(relationid).then(
      data => {
        if (data.sucess) {
          util.sendResponse(res, true, 'sucess', data);
        } else {
          util.sendResponse(res, false, 'sucess', data);
        }
      }
    ).catch(err => {
      console.log(err);
      util.sendResponse(res, false, err, null)
    })
  }
})

// relation data;  获取关系信息，已经产生关联的用户
function getRelationData(relation) {
  return new Promise((resolve, reject) => {
    user.findOne({
      uid: relation.uid
    }).then(data => {
      resolve(data);
    })
  })
}

// relation data;  获取关系信息，已经产生关联的用户
function getRelationDataV2(relation) {
  return new Promise((resolve, reject) => {
    user.findOne({
      uuid: relation.linkid
    }).then(data => {
      resolve(data);
    })
  })
}


/*
 获取最新的图片信息
*/
function getrectntFile() {
  return new Promise((resolve, reject) => {
    fileRepository.getRecentPhotV2(data => {
      resolve(data);
    })
  })
}
module.exports = app;