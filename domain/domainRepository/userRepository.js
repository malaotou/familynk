var express = require('express');
var md5 = require('md5');
var apiRoutes = express.Router();
var app = express();
var bodyParser = require('body-parser');

var user = require('../domainModel/user');
var util = require('../../utils/utils');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

/*
    用户检索，通过用户ID 检索该用户，检索条件微信Id
*/
var userRepository = {
    getUserbyWeChatId(userinfo) {
        return new Promise((resolve, reject) => {
            checkUserExists(userinfo)
                .then(data => {
                    resolve(data)
                })
                .catch(err => reject(err));
        })
    },
    // 创建新用户，无任何的关联关系，自主登录认证，如果存在关联关系则通过传入参数处理
    createNewUser(userinfo) {
        return new Promise((resolve, reject) => {
            var newUser = new user(userinfo);
            newUser.save().then((data) => {
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
    // 邀请认证，通过邀请链接进入用户已经注册。
    createLink(linkeid, userinfo) {
        user.updae({
            name: "Andy"
        }, {
            name: "Andy",
            rating: 1,
            score: 1
        }, {
            upsert: true
        })
    },
    updateUserInfo(userinfo) {
        return new Promise((resolve, reject) => {
            try {
                // user.update({$set:{name:"XXXx"},{uid:userinfo.uid},})
                db.models.User.findOneAndUpdate({
                    uuid: userinfo.uuid
                }, {
                    $set: {
                        "name": userinfo.name,
                        "gender": userinfo.gender,
                        "birth": userinfo.birth,
                        "birthyear": (userinfo.birth != null) ? userinfo.birth.substring(0, 4) : "",
                        "address": userinfo.address,
                        "nationality": userinfo.nationality,
                        "avatarUrl": userinfo.avatarUrl,
                        "firstlogiin": "false"
                    }
                }).exec();
                resolve({
                    sucess: true,
                    message: 'sucess',
                    data: null
                })
            } catch (e) {
                console.log(e);
                reject({
                    sucess: false,
                    message: e,
                    data: null
                })
            }

        })
    },
    getRelatedUser(uid) {
        return new Promise((resolve, reject) => {
            user.find({
                    uid: uid
                })
                .then(data => {
                    resolve({
                        sucess: true,
                        data: data,
                        message: 'sucess'
                    });
                })
        })
    },
    deleteUser(userinfo) {

        return db.models.User.deleteOne({
            uuid: userinfo.uuid
        })
        // return new Promise((resolve, reject) => {
        //     try {
        //         db.models.User.deleteOne({
        //             uuid: userinfo.uuid
        //         }).exec()
        //         resolve()

        //     } catch (err) {
        //         reject(err);
        //     }

        // })
    },
    getuserById(uuid) {
        return new Promise((resolve, reject) => {
            user.findOne({
                    uuid: uuid
                })
                .then(data => {
                    resolve({
                        sucess: true,
                        data: data,
                        message: 'sucess'
                    });
                })
        })
    }
}

function updateUser(userinfo) {

    return new Promise((resolve, reject) => {

        var u = user.find({
            uid: userinfo.uid
        }).then(data => {
            // 
            data.name = userinfo.name;
            var u = Object.assign({}, data, {
                name: "测试"
            });
            console.log(u, 'XXXXXXXXXXXXXXXXXX')
            var newUser = new user(u);
            newUser.save().then(
                data2 => {
                    console.log(data2, 'XXXXXXXXXXXXXXXXXX')
                }
            )
        })
        resolve({
            sucess: true,
            message: 'sucess',
            data: null
        })
    })
}

function checkUserExists(userinfo) {
    return new Promise((resolve, reject) => {
        user.findOne({
                $or: [{
                        uid: userinfo.uid
                    },
                    {
                        uuid: userinfo.uuid
                    }
                ]
            }).sort({
                uid: -1
            })
            .then(data => {
                if (data != null && data.length > 0) {
                    resolve({
                        sucess: true,
                        data: data,
                        message: 'sucess'
                    })
                } else {
                    resolve({
                        sucess: false,
                        data: data,
                        message: 'not exists'
                    })
                }

            })
            .catch(err => {
                console.log(err);
                reject({
                    sucess: false,
                    data: null,
                    message: err
                })
            })
    })
}

function isEmpty(val) {
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}
module.exports = userRepository;