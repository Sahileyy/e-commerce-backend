import mongoose from "mongoose";
import products from "../models/productModel.js";
import category from "../models/categoryModel.js";




// ********************************************!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!**********************************!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


export async function productView(req,res) {
    try{
        const allProducts = await products.find().populate('category')
        console.log(allProducts);
        
        res.json(allProducts)
    }

    catch (err){
        console.log(err);
        
    }
    
    
}

export async function viewCategory(req,res){
    try{
        const allCategory = await category.find()
        console.log(allCategory)
        
        res.json(allCategory)
        

    }
    catch(err){
        console.log(err);
        
    }
}

