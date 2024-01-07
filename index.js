const express =require("express");
const app=express();
const bodyParser = require('body-parser');
const mongoose=require("mongoose")
const {Shorten}=require("./model/shorten")
const {uid}=require("uid")
const PORT=process.env.PORT || 3000 ;
const DB = process.env.Mongo_Url;
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine","ejs");
app.set("views","./view")
app.use(express.static("public"))
//mongodb connection
mongoose
  .connect(DB)
  .then(() => console.log("connected MongoDB"))
  .catch((err) => console.log("error", err));
app.use((req,res,next)=>{
    console.log(`${req.method} request on ${req.url} ${res.statusCode} on ${Date.now()}`);
    next();
})
app.get("/",async(req,res)=>{
    // res.send({message:"Welcome to the API"});
    res.render("Home",{title:"Home"})
})
app.get("/urls/view/:id",async(req,res)=>{
    const {id}=req.params;
    try{
        let data=await Shorten.find({link:id});
        if(!data){return res.redirect('/')};
        console.log(data)
        return res.render("View",{data:data,title:"Link View"});
        }catch(err){console.log(err)}
})
app.get("/urls/all",async(req,res)=>{
    const allUrls=await Shorten.find({});
    res.render("Allurls",{urls:allUrls?allUrls:null,title:"Urls"})
})
app.get ("/urls/view",(req,res)=>{
    res.render("Search",{title:"Search"})
})
app.post("/",async(req,res)=>{
    const {url}=req.body;
    try{
    if(!url){
        return res.status(400).send({message:'URL is required'});
        }
        let result=await Shorten.create({
            url: url,
            link:uid(6),
            views:0
        })
        res.render("Home",{data:result?result:null,urls:null,title:"Home"})
    }catch(err){
        console.log(err)
        res.status(500).send("error")
    }
})
app.get("/:link",async(req,res)=>{
    const{link}= req.params;
    const data= await Shorten.findOne({link});
    if (!data) {
        return res.status(404).send({ message: "Not Found." });
        } else {
            data.views+=1;
            await data.save();
            res.redirect(data.url);
            }
})

app.listen(PORT,()=>{
    console.log("Server running on port",PORT)
})