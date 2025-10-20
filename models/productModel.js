import mongoose from "mongoose";


const productSchema  = new mongoose.Schema({
   
    product_name:{type:String,required: true},
    price:{type:Number,required:true},
    description:{type:String},
      category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  image:{type:String}
})

const products=  mongoose.model('products',productSchema)
export default  products