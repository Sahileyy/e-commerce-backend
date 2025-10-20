import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    name:{type:String,required:true,unique: true},
    description:{type:String}
})

const category = mongoose.model('category',categorySchema)
export default category