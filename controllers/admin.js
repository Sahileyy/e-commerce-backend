
import bcrypt from 'bcrypt'

import users from '../models/usersModel.js'
import products from '../models/productModel.js'
import category from '../models/categoryModel.js'


export async function loginControl(req,res){
    try{
    
        const {username:username,
            password:password
        } =  req.body
        const saltRounds = 10;
     
        const login_name = await users.findOne({username:username})
        console.log(login_name);
        const pass_check = await  bcrypt.compare(password,login_name.password)
        
        req.session.role = login_name.role;
        req.session.username = login_name.username
      
        if(login_name.role === "user" && pass_check){
         
           return  res.json('USER LOGGED IN')
        }
        if(!login_name.username && pass_check){
            return res.json("Invalid username")
        }
    // console.log(req.session);
          if( login_name.role === 'user' && !pass_check){
            return res.json("Check password")
        }

        
    }
    catch(err){
        console.log(err);
        return res.json('invalid login')
        
    }
}
// ***************************!!!!!!!!!!!!!!!!!*****************************!!!!!!!!!!!!!!!!!!!!!!!!*****

export async function  adminLoginControl(req,res){
    try{
          const {username,email,
            password
        } =  req.body;
    
        console.log(req.body);
        
        
        const login_name = await users.findOne({username:username})
        console.log(login_name);

                if (!login_name) {
      return res.json("admin not found" );
    }


        if(!login_name.role === "admin" ){

            return res.json("Check username")
        }
         const pass_check = await  bcrypt.compare(password,login_name.password)
        
         req.session.role = login_name.role;
         req.session.username = login_name.username
         
         if(login_name.role === "admin" && pass_check){

            return res.json("ADMIN LOGGED IN")
        }
          
          
        if(login_name.role === "admin"&& !pass_check){

            return res.json("Check password")
        }

    }
    catch(err){

        console.log(err);
        
          return res.json("Invalid authentication")


    }
}





// ***************************!!!!!!!!!!!!!!!!!*****************************!!!!!!!!!!!!!!!!!!!!!!!!*****



export let allUsers

export async function adminView(req,res) {
    try{
        allUsers = await users.find()
        return res.json(allUsers)
    }
    catch(errr){
        console.log(errr);
        
    }   
}

// ***************************!!!!!!!!!!!!!!!!!******************category***********!!!!!!!!!!!!!!!!!!!!!!!!***************!!!!!!!!!!!!!!!!!!!!!
export async function addCategory(req,res) {
    try{
        const {
            name:name,
            description:description
        } = req.body
        
        
       const  newCategory = req.body
    //    console.log(newCategory);
       
        const categoryAdded = await category.create(newCategory)
        console.log(categoryAdded);
        
       return res.json(categoryAdded)
    }
    catch(err){
        console.log(err);
    }

    
}

// ***************************!!!!!!!!!!!!!!!!!******************delete category***********!!!!!!!!!!!!!!!!!!!!!!!!***************!!!!!!!!!!!!!!!!!!!!!
export async function deleteCategory(req,res){
    try{
        const id = req.params.id
        const selectedCategory = await category.findByIdAndDelete(id)
        if(!selectedCategory){
            return res.status(404).json("invalid product")
        }
        if(selectedCategory){
            const deleteProducts = await products.deleteMany({
                category:id

            })
            console.log(deleteProducts);
            

            return res.status(200).json(selectedCategory)
        }
    }
    catch(err){
        console.log(err);
        
    }

}
// / ***************************!!!!!!!!!!!!!!!!!******************category update***********!!!!!!!!!!!!!!!!!!!!!!!!***************!!!!!!!!!!!!!!!!!!!!!

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedCategory = await category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, message: "Category updated successfully", category: updatedCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}


export async function getSingleCategory(req, res) {
  try {
    const id = req.params.id;
    const selectedCategory = await category.findById(id);
    if (!selectedCategory) {
      return res.status(404).json("Category not found");
    }
    res.status(200).json(selectedCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error fetching category");
  }
}



// ***************************!!!!!!!!!!!!!!!!!******************PRODUCT***********!!!!!!!!!!!!!!!!!!!!!!!!***************!!!!!!!!!!!!!!!!!!!!!

export async function productInsert(req,res){
    try{

            
    const { product_name, price, description, category } = req.body;

    console.log(req.body);
    const product_check = await products.findOne({product_name:product_name})
    if (!product_check){
               const result = await products.insertOne({
                 product_name,
                 price,
                 description,
                 category,
                 image: req.file ? `/uploads/${req.file.filename}` : null,
               });
          console.log(result);
          

                return res.json(result)
        
        }
        else{
            
            res.json("Already inserted")
        }
        
           
          
           

    }
    catch(err){
        
        console.log(err);
    }
}



// / ***************************!!!!!!!!!!!!!!!!!******************PRODUCTDELETE***********!!!!!!!!!!!!!!!!!!!!!!!!***************!!!!!!!!!!!!!!!!!!!!!

export async function deleteProduct(req,res){
    try{
        const id = req.params.id

        const selectedProduct = await products.findByIdAndDelete(id)
        if(!selectedProduct){
            return res.json("invalid product")
        }
        if(selectedProduct){
    console.log(selectedProduct);
    return res.json("succesfull deleted")
        }
    }
    catch(err){
        console.log(err);
        
    }
}


// / ***************************!!!!!!!!!!!!!!!!!******************PRODUCTupdate***********!!!!!!!!!!!!!!!!!!!!!!!!***************!!!!!!!!!!!!!!!!!!!!!

export async function updateProduct(req,res){
    try{
        const id = req.params.id

        const selectedProduct = await products.findByIdAndUpdate(id)
        if(!selectedProduct){
            return res.json("invalid product")
        }
        if(selectedProduct){
    console.log(selectedProduct);
    return res.json("succesfull updated")
        }
    }
    catch(err){
        console.log(err);
        
    }
}


// / ***************************!!!!!!!!!!!!!!!!!****************************!!!!!!!!!!!!!!!!!!!!!!!!***************!!!!!!!!!!!!!!!!!!!!!