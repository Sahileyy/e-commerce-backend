import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {type:String,required:true,unique:true},
    email : {type:String,required:true},
    password: {type:String,required:true},
    role: {type:String,enum:['user','admin'],default:'user' },
    status:{type:String,enum:['enable','disable'],default:true}
  
})
const users= mongoose.model("Users", userSchema);
export default users;