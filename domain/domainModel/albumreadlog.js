var Schema = db.Schema;
var AlbumReadLogSchema = new Schema({
    albumuuid: String, // RelatedId
    uuid: String,
    date: String
})
var AlbumReadLog = db.model('AlbumReadLog', AlbumReadLogSchema);
module.exports = AlbumReadLog;