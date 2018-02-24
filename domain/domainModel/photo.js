var Schema = db.Schema;
var PhotoSchema = new Schema({
    uid: String, // RelatedId
    weid: String,
    note: String,
    date: String,
    status: Boolean, //是否删除
    src: String,
    uuid: String,
    images: [{
        src: String,
        name: String
    }]
})
var Photo = db.model('Photo', PhotoSchema);
module.exports = Photo;