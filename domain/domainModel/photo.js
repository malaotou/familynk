var Schema = db.Schema;
var PhotoSchema = new Schema({
    uid: String, // RelatedId
    weid: String,
    note: String,
    src: String,
    uuid: String,
    albumuuid:String,
    images: [{
        src: String,
        name: String
    }],
    date: String,
    status: Boolean, //是否删除
    creator:String
})
var Photo = db.model('Photo', PhotoSchema);
module.exports = Photo;