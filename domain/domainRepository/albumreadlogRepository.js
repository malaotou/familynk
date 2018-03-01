var express = require('express');
var md5 = require('md5');
var apiRoutes = express.Router();
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
var util = require('../../utils/utils');
var config = require('../../utils/config');
var albumReadlog = require('../../domain/domainModel/albumreadlog');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

var albumreadLogRepository = {
    createHis(readlog) {
        return new Promise((resolve, reject) => {
            var albumLog = new albumReadlog({
                uuid: readlog.uuid,
                albumuuid: readlog.albumuuid,
                date: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            });
            albumReadlog.findOne({
                uuid: readlog.uuid,
                albumuuid: readlog.albumuuid,
            }).then(log => {
                if (!log) {
                    albumLog.save().then(data => {
                            resolve(data)
                        })
                        .catch(err => {
                            reject(err);
                        })
                } else {
                    resolve();
                }
            })


        })
    },
    getHis(readlog) {
        return new Promise((resolve, reject) => {
            albumReadlog.findOne({
                uuid: readlog.uuid,
                albumuuid: readlog.albumuuid,
            }).then(data => {
                resolve(data)
            }).catch(err => {})
        })
    }
}

module.exports = albumreadLogRepository;