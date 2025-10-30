import mongoose from "mongoose";
import products from "../models/productModel.js";
import category from "../models/categoryModel.js";
import { log } from "console";




// ********************************************!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!**********************************!!!!!!!!!!!!!!!!!!!!!!!!!!!!!




export async function getProductbyCategory(req, res) {
    console.log("req came in");
    
  try {
    const { id } = req.params;

   
    const selectedProducts = await products.find({ category: id });
    const catName = await category.findById(id)
    
    
    

    return res.status(200).json({
        products:selectedProducts,
        category_name:catName.name
    });
  } catch (err) {
    console.error("Error fetching products by category:", err);
    return res.status(500).json([]);
  }
}


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

export async function logout(req,res) {
    try{
        res.session.destroy(()=>{
            res.json({message:'logout'})

    })
    }
    catch(err){
        console.log(err);
       return res.json(err)
        
    }
    
}

export async function isAuth (req,res){
    try{
        if(req.session.user_id){
            res.json({
                isAuth:true,
                role:req.sesssion.role,
                user_id:req.session.user_id
            })
            
            }
            else{
                res.json({isAuth:false})
            }
        }
    
    catch(err){
        console.log(err);
        
    }
}

