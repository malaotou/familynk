var Schema=db.Schema;
var RelationSchema=new Schema({
    weid:String, // RelatedId, 源id
    uid:String,  // 邀請id
    relation:String, //關係
    relationId:String, // id_id
    birthday:String,
    nationality:String,
    address:String,
    name:String,
    isLink:Boolean,
    linkid:String,
    uuidlink:String,
    birthyear:String,
    creator:String
    // detail:{
    //     age:Number,
    //     sex:Number,
    //     nationality:String
    // }
})

var Relation=db.model('Relation',RelationSchema);
module.exports=Relation;

