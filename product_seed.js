const mongoose=require("mongoose");
const product=require("./model/Product")
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("DB connected");
})
.catch(()=> console.log("Error in connecting db"))


new product({name:"bicycle",description:"jab",type:"vehicle",authorid:"ahgdwaj",img:["adaa"],price:123}).save()
.then((data)=> console.log(data))
.catch((err)=> console.log(err));