const mongoose=require("mongoose");

const imgModel=new mongoose.Schema({
    imgId:String,
    img:{
        data:Buffer,
        contentType: String
    },
    imgName:String
})

const image=mongoose.model('Image',imgModel);
module.exports=image;