const mongoose=require("mongoose");
const user=require("./model/user");
const product=require("./model/product.js");
const express=require("express");
const path=require('path');
const imgModel=require("./model/image");
const fs=require('fs');

const  typesList = ['vehicle', 'stationary', 'electric appliance'];
require('dotenv/config');
const app=express();
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))
app.use(express.static(path.join(__dirname,'public')))
app.use((express.urlencoded({extended:true})));
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("DB connected");
})
.catch(()=> console.log("Error in connecting db"))
app.get('/',(req,res)=>{
  res.redirect('/home');
})
app.get('/home',(req,res)=>{
  console.log("hello");
  res.render('home.ejs',{ispassmatch:true});
});



var multer = require('multer');
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });



app.post('/signup', (req,res)=>{
  var details=req.body;
  console.log(details);
  if(details.sig_pass===details.conf_pass)
  {
    const signup=new user({name: details.sig_name,email: details.sig_email,pass:details.sig_pass,phoneNo:details.phoneNo})
    signup.save()
   .then((data)=>{
    console.log(data);
    res.redirect("/");
    })
    .catch((error)=> console.log(error));
  }
  else{
    console.log("hi")
    const ispassmatch=false;
    res.render("home.ejs",{ispassmatch});
  } 
  
});




app.get('/login',async (req,res) => {
  const details=req.query;
  console.log(details);
  const isCorrect=await user.findOne({email:details.log_email,pass: details.log_pass});
  console.log(isCorrect);
  if(isCorrect!==null)
  {
    //res.send("Login Success");
    res.redirect("/home2?_id="+isCorrect._id);
  }
  else
  {
    res.send("login failed");
  }
  
});



app.get('/home2',async (req,res)=>{
  const id=req.query._id;
  const details=await  user.findById(id);
  const productsList=await product.find({});
  res.render("home2.ejs",{productsList,id});
})


app.get('/sellItem',(req,res)=>{
  const id=req.query.id;
  // console.log(id);
  imgModel.find({imgId:id},(err,items)=>{
    if (err) {
    console.log(err);
    res.status(500).send('An error occurred', err);
    }
    else {
    res.render('sellItem.ejs', { items: items,id:id,typesList});
    }
  });
});

app.post('/postProduct',async (req,res)=>{
  console.log(req.body);
  const body=req.body;
  const images=await imgModel.find({imgId:body.id});

  const arr=[];

  for(let image of images)
  {
    const obj={
      data:image.img.data,
      contentType: image.img.contentType,
    }
    arr.push(obj);
    console.log(obj.contentType);
  }

  console.log(arr.length);

  
  
   const newproduct= new product({
     name: body.productName,
     description: body.productDescription,
     type: body.type,
     price: body.productPrice,
     authorid: body.id,
     img: arr
   });

   newproduct.save()
   .then((data)=>{
     imgModel.deleteMany({imgId:body.id})
     .then((data)=>console.log(data))
     .catch((err)=>console.log(err))
     res.redirect("/home2?id="+body.id);
   })
   .catch((err)=> console.log(err));
})


// productPrice: '',
//   productName: '',
//   type: 'vehicle',
//   productDescription: ''


// type:{
//   type:String,
//   enum:["electronics","stationary","vehicle","other"]
// },
// authorid:{
//   type:String
// },
// img:[{
// data:Buffer,
// contentType:String
// }],
// price:{
//   type:Number
// }

app.post('/sellItem', upload.single('image'), (req, res, next) => {
  var id=req.query.id;
  var obj = {
      imgId: id,
      img: {
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
          contentType: 'image/png'
      },
      imgName:req.file.filename
  }

  console.log(obj.imgName);
  imgModel.create(obj, (err, item) => {
      if (err) {
          console.log(err);
      }
      else {
          // item.save();
          fs.unlink(path.join(__dirname,'/uploads/'+obj.imgName) , (err) => {
            if (err) {
                console.log("failed to delete local image:"+err);
            } else {
                console.log('successfully deleted local image');                            
            }
    });
          res.redirect('sellItem?id='+id);
      }
  });

});


app.post('/destroyImage',(req,res)=>{
  console.log(req.body);
  const id=req.query.id;
  const fileName=req.body.imageName;
  const image=imgModel.find({imgName:fileName});
  imgModel.findOneAndDelete({imageName: fileName}, function(err) {
    if(err) {
      //Error Handling
    }
    else {

      imgModel.deleteOne({imgName: fileName})
      .then((data)=> console.log(data))
      .catch((err)=>{
        console.log(err);
      });
      res.redirect("/sellItem?id="+id);
    }
  });



})



app.get('/productDetail',async (req,res)=>{
  const query=req.query;
  const productId=query.productId;
  const id=query.id;
  var productDetails;
  await product.findOne({_id:productId},(err,productDetail)=>{
    if(err)
    {
      console.log(err);
    }else{
      console.log(productDetail);
      productDetails=productDetail;
    }
  })
  

  console.log("1",productDetails);
  res.render("productDetail.ejs",{productDetails,id,current:0})
})





app.listen(3000,()=>{
  console.log("Listening on port 3000")
})

