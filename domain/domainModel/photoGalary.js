var Schema=db.Schema;
var PhotoGalarySchema=new Schema({
    uid:String, // RelatedId
    src:String
})
var PhotoGalary=db.model('PhotoGalary',PhotoGalarySchema);
module.exports=PhotoGalary;
