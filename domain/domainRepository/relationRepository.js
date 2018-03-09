var express = require('express');
var md5 = require('md5');
var apiRoutes = express.Router();
var app = express();
var bodyParser = require('body-parser');

var user = require('../domainModel/user');
var relation = require('../domainModel/relateionUser')
var util = require('../../utils/utils');

var relationRepository = {

    getRelationUser(userInfo) {
        return new Promise((resolve, reject) => {
            relation.find({
                    uuidlink: userInfo.uuid
                })
                .then(
                    data => {
                        resolve({
                            sucess: true,
                            message: 'sucess',
                            data: data
                        })
                    }
                )
                .catch(
                    err => {
                        reject({
                            sucess: false,
                            message: err,
                            data: null
                        })
                    }
                )
        })
    },
    // 确认对应的关系，使两人产生关联
    confirmRelation(relationinfo, userinfo) {
        return new Promise((resolve, reject) => {
            // 首先检测是否已经被认领，如果关系已经成立，则不能重新建立关系。
            var relation = db.models.Relation.findOne({
                _id: relationinfo.id
            });
            if (relation != null && relation.isLink == false) {
                db.models.Relation.findOneAndUpdate({
                    _id: relationinfo.id
                }, {
                    $set: {
                        "isLink": true,
                        "linkid": userinfo.uid,
                    }
                }).exec(function (err, relation) {
                    if (err) {
                        reject({
                            sucess: false,
                            data: null
                        })
                    } else {
                        resolve({
                            sucess: true,
                            data: relation
                        })
                    }
                });
            } else
                reject({
                    sucess: false,
                    data: null
                })

        })
    },
    addRelation(relationInfo) {
        return new Promise((resolve, reject) => {

            var newRelation = new relation(relationInfo);
            newRelation.save()
                .then((data) => {
                    resolve({
                        sucess: true,
                        data: data,
                        message: 'sucess'
                    })
                })
                .catch(err => {
                    reject({
                        sucess: false,
                        data: null,
                        message: err
                    })
                })
        })

    },
    removeRelation(relatonId, OpUser) {
        return new Promise((resolve, reject) => {
            relation.remove({
                    _id: relationid
                })
                .then(da => {
                    resolve({
                        sucess: true,
                        data: data,
                        message: 'sucess'
                    })
                })
                .catch(err => {
                    reject({
                        sucess: false,
                        data: null,
                        message: err
                    })
                })
        })
    },
    getrelationbyid(relationid) {
        return new Promise((resolve, reject) => {
            relation.findOne({
                _id: relationid
            }).then(data => {
                if (data != null) {
                    resolve({
                        sucess: true,
                        data: data
                    })
                } else {
                    reject({
                        sucess: false,
                        data: null
                    })
                }
            })
        })

    },
    updateRelation(relation) {
        return new Promise((resolve, reject) => {
            db.models.Relation.findOneAndUpdate({
                _id: relation.id
            }, {
                $set: {
                    linkid: relation.uuid
                }
            }).then(data => {
                resolve(data)
            }).catch(
                err => reject(err));
        })
    }
}

// app.get('', function (req, res) {
//   var u={
//     weid:123, // RelatedId,
//     uid:123,
//     relation:'String',
//     relationId:'String', // id_id_id_id
//   }
//   var relationUser =new relation(u);
//   relationUser.save().then(()=>console.log('meow'));

//   relation.find(null).then(data=>
//   {
//     console.log(data);
//     res.send({data});
//     res.end();
//     }
//   ); 
// });



/*
      { name: '爸爸', id: 1 }, 
      { name: '妈妈', id: 2 }, 
      { name: '哥哥', id: 3 }, 
      { name: '姐姐', id: 4 }, 
      { name: '弟弟', id: 5 }, 
      { name: '妹妹', id: 6 }, 
      { name: '老婆', id: 7 }, 
      { name: '老公', id: 8 }, 
      { name: '儿子', id: 9 }, 
      { name: '女儿', id: 10 }

*/
module.exports = relationRepository;