import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : true
    },
    items : [
        { productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "products",
            required : true
        },  quantity : {
            type : Number,
            min : 1,
            default: 1,
            required : true
        }, price : {
            type : Number,
            required : true
        }
        }
    ],

    totalAmount : {
        type : Number,
        required : true ,
        default   : 0
    }
})

const cart = mongoose.model("cart",cartSchema)

export default cart