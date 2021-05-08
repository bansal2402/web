const mongoose=require("mongoose");
const Product=require("./model/product");
mongoose.connect('mongodb://localhost:27017/productdb', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("DB connected");
})
.catch(()=> console.log("Error in connecting db"))

const k=new Product({name:"grape",price: 200,category: "fruit"});
// k.save()
// .then(p =>{
//     console.log(p);
// })
// .catch(error =>{
//     console.log(err);
// })

const collection=[
    {
        name:"grape",
        price: 200,
        category: "fruit"
    },
    {
        name:"carrot",
        price: 50,
        category: "vegetable"
    },
    {
        name:"milk",
        price: 55,
        category: "dairy"
    }
]

Product.insertMany(collection)
.then(p=> console.log(p))
.catch(err=>console.log(err))