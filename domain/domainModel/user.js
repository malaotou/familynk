// var mongoose=require('mongoose');
// //var db=mongoose.createConnection('mongodb://familyadmin:familyadmin@ds046667.mlab.com:46667/familynk');
// //mongoose.connect('mongodb://familyadmin:familyadmin@ds046667.mlab.com:46667/familynk'); 
// mongoose.connect('mongodb://localhost/familynk'); 

var Schema = db.Schema;
var UserSchema = new Schema({
    uid: String, //微信 openId
    name: String, //姓名
    birth: Date, //出生日期
    birthyear: String, //出生日期
    nationality: String, // 籍贯，
    address: String, // 现居住地
    death: Date, //去世时间
    phone: Number, //联系电话,
    avatarUrl: String, // 头像
    city: String,
    province: String,
    gender: String,
    country: String,
    birthyear: String,
    uuid: String,
    creator: String,
    firstlogiin: String
})

var User = db.model('User', UserSchema);
module.exports = User;