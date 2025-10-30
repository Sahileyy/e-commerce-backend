import mongoose from "mongoose";
import products from "../models/productModel.js";
import users from "../models/usersModel.js";
    
const orderSchema = ({
        user_id:{ type: mongoose.Schema.Types.ObjectId, ref: "Users" ,required:true},
         items: [
    {
      product_id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      total_item:{ type: Number, required: true }
    },
  ],
  total_price: { required: true, type: Number },
  status: { type: String, default: "pending" },
    })

    const orders = mongoose.model('orders',orderSchema)
    export default orders