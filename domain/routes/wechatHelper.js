    var express = require('express');
    var md5 = require('md5');
    var app = express();
    var bodyParser = require('body-parser');
    var request = require('request');
    var utils = require('../../utils/utils');
    var userRepository = require('../domainRepository/userRepository');
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    var we = require('../../utils/config').we;
    app.use(bodyParser.json());
    /*得到当前用户参加过的所有活动*/
    app.post('', function (req, res) {
        // 需要每次获取更新  //openid=o7iou5ZOsK-3y3WbceGD6olmIwlM
        //var js_code = req.query.js_code //'001gRKeN0ktTx42f23eN0hbseN0gRKeH'; //req.query.js_code
        console.log(req.body);
        request({
            uri: "https://api.weixin.qq.com/sns/jscode2session?appid=" +
                we.appid +
                "&secret=" +
                we.secret +
                "&js_code=" +
                req.body.js_code +
                "&grant_type=authorization_code",
            method: 'GET',
            followRedirect: true,
            maxRedirects: 10
        }, function (err, response, body) {
            if (err) {
                utils.sendResponse(res, false, err, null)
            } else {
                // 检查用户是否注册，未注册，则登记信息，并提示用户完善信息。
                userRepository.getUserbyWeChatId({
                        uid: (JSON.parse(body)).openid
                    })
                    .then(data => {
                        console.log(body, 'body');
                        req.body.uid = (JSON.parse(body)).openid;
                        if (!data.data || data.data.length == 0) {
                            // 未注册，
                            userRepository.createNewUser(req.body)
                                .then(data => {
                                    utils.sendResponse(res, true, 'sucess', body);
                                })
                                .catch(err => {
                                    console.log(err, "error");
                                    utils.sendResponse(res, false, err, null);
                                })

                        } else {
                            console.log(data.data, "data.data");
                            utils.sendResponse(res, true, 'sucess', data.data);
                        }
                    })
            }
        })
    });

    module.exports = app;