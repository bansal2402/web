const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String
    },
    description:{
        type:String
    },
    type:{
        type:String,
        enum:["electronics","stationary","vehicle","other"]
    },
    authorid:{
        type:String
    },
    img:[{
      name:String
    }],
    price:{
        type:Number
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;