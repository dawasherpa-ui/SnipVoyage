const mongoose = require("mongoose");
//const {ObjectId}=mongoose.Schema;
let urlSchema = new mongoose.Schema({
  url: { type: String ,required:true,lowercase:true},
  link:{type:String,required:true,unique:true},
  views:{type:Number,required:true}
});
const Shorten=mongoose.model("urls",urlSchema)
module.exports={Shorten};
