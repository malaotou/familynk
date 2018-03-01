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
var photo = require('../domainModel/photo');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

var fileRepository = {
    createFile(postFileInfo) {
        return new Promise((resolve, reject) => {
            if (postFileInfo.files != undefined && postFileInfo.files != null) {
                var path = postFileInfo.files.file.path;
                var destPath = config.file.path;
                fs.exists(destPath, ext => {
                    if (!ext) {
                        fs.mkdir(destPath, err => {
                            console.log(err);
                            reject(err);
                        });
                        SaveFile(postFileInfo.files.file.name, destPath, postFileInfo.files.file.path)
                            .then(file => {
                                resolve(file);
                            });
                    } else {
                        SaveFile(postFileInfo.files.file.name, destPath, postFileInfo.files.file.path)
                            .then(file => {
                                resolve(file);
                            });
                    }
                })
            }
        })
    },
    savedbFileInfo(fileinfo) {
        return new Promise((resolve, reject) => {
            // var data = db.models.Photo.findOne({
            //     uuid: fileinfo.uuid,
            //     albumuuid: fileinfo.albumuuid
            // }, (err, result) => {
            //     console.log(err, result)
            // })
            photo.findOne({
                uuid: fileinfo.uuid,
                albumuuid: fileinfo.albumuuid
            }).then(data => {

                    // 创建 
                    if (data == null) {
                        var newPhoto = new photo(fileinfo);
                        newPhoto.save().then(
                            () => {
                                resolve({
                                    sucess: true,
                                    msg: null
                                });
                            }
                        )
                    }
                    // 更新
                    else {
                        db.models.Photo.findOneAndUpdate({
                            uuid: fileinfo.uuid,
                            albumuuid: fileinfo.albumuuid
                        }, {
                            $addToSet: {
                                images: {
                                    src: fileinfo.src,
                                }
                            }
                        }).exec();
                        resolve({
                            sucess: true,
                            msg: null
                        });
                    }
                }

            )
        })
    },
    getRecentPhot(uid) {
        return new Promise((resolve, reject) => {
            photo.find({
                    uid: uid
                })
                .then(data => {
                    resolve({
                        sucess: true,
                        message: 'sucess',
                        data: data
                    })
                })
        })
    },
    getRecentPhotV2(uuid) {
        return new Promise((resolve, reject) => {
            photo.aggregate(
                    [{
                            $match: {
                                uuid: uuid
                            }
                        },
                        {
                            $sort: {
                                date: -1
                            }
                        },
                        {
                            $limit: 1
                        }
                    ]
                )
                .then(data => {
                    resolve({
                        sucess: true,
                        message: 'sucess',
                        data: data
                    })
                })
        })
    },
    // 查找所有相关的数据信息
    getPhotoByIds(ids) {
        return new Promise((resolve, reject) => {
            photo.find({
                    uid: {
                        $in: ids
                    }
                })
                .sort({
                    uid: -1
                })
                .then(data => {
                    resolve({
                        sucess: true,
                        message: 'sucess',
                        data: data
                    })
                })
        })
    }
}

function SaveFile(filename, destPath, sourcePath) {
    return new Promise((resolve, reject) => {
        var destFile = destPath + '\\' + filename;
        var source = fs.createReadStream(sourcePath);
        var dest = fs.createWriteStream(destFile);
        source.pipe(dest);
        source.on('end', function () {
            fs.unlinkSync(sourcePath);
            resolve(filename);
        })
    })
}

module.exports = fileRepository;