
import bcrypt from 'bcrypt'

import users from '../models/usersModel.js'
import products from '../models/productModel.js'
import category from '../models/categoryModel.js'
import orders from '../models/ordersModel.js'
import { response } from 'express'

export async function loginControl(req, res) {
  try {
    const { username, password } = req.body;

    const loginUser = await users.findOne({ username });
    if (!loginUser) {
      return res.json({ message: "Invalid username" });
    }

    const passCheck = await bcrypt.compare(password, loginUser.password);
    if (!passCheck) {
      return res.json({ message: "Invalid password" });
    }

    if (loginUser.role !== "user") {
      return res.json({ message: "Not authorized as user" });
    }

    // Store session info if using express-session
    req.session.user_id = loginUser._id;
    req.session.role = loginUser.role;
    req.session.username = loginUser.username;

    // ✅ send proper response
    return res.json({
      message: "USER LOGGED IN",
      user: {
        id: loginUser._id,
        username: loginUser.username,
        email: loginUser.email,
        role: loginUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.json({ message: "Invalid login" });
  }
}

// ***************************!!!!!!!!!!!!!!!!!*****************************!!!!!!!!!!!!!!!!!!!!!!!!*****
export async function adminLoginControl(req, res) {
  try {
    const { username, password } = req.body;

    const adminUser = await users.findOne({ username });
    if (!adminUser) {
      return res.json({ message: "Admin not found" });
    }

    if (adminUser.role !== "admin") {
      return res.json({ message: "Not authorized as admin" });
    }

    const passCheck = await bcrypt.compare(password, adminUser.password);
    if (!passCheck) {
      return res.json({ message: "Invalid password" });
    }

    req.session.role = adminUser.role;
    req.session.username = adminUser.username;

    // ✅ send consistent response
    console.log(adminUser);
    return res.json({
      message: "ADMIN LOGGED IN",
      user: {
        id: adminUser._id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
    
  } catch (err) {
    console.error(err);
    return res.json({ message: "Invalid authentication" });
  }
}


// ***************************!!!!!!!!!!!!!!!!!*****************************!!!!!!!!!!!!!!!!!!!!!!!!*****

export async function editUser(req,res) {
    try{
    const id = req.params.id;
const { enable } = req.body || {}; // Prevent crash

if (typeof enable === 'undefined') {
  return res.status(400).json({ error: "'enable' field is required in body" });
}

// const updatedBooleanValue = Boolean(enable);

const found = await users.findByIdAndUpdate(
  id,
  { $set: {enable} },
  { new: true }
);
console.log(found);


if (!found) {
  return res.json("user not found");
}

res.json({
  message: `${found.username} is updated`,
  success: true,
});

    }
    catch(err){
        console.log(err);
        
    }
}




export async function adminView(req, res) {
  try {

    const allUsers = await users.find(); 
    
    console.log(allUsers);

    // Send JSON response
    return res.status(200).json(allUsers);
  } catch (err) {
    console.error("Error fetching users:", err);
    return;
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
            return res.json("invalid product")
        }
        if(selectedCategory){
            const deleteProducts = await products.deleteMany({
                category:id

            })
            console.log(deleteProducts);
            

            return res.status(200).json({message:"category and products inside deleted"})
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
               const result = await products.create({
                 product_name,
                 price,
                 description,
                 category,
                 image: req.file ? `/uploads/${req.file.filename}` : null,
               });

          console.log(result);
          res.json('product added susseccfully')

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

// Get single product by ID

export  async function getSingleProductAdmin(req,res){
  try {
    const product = await products.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Server error while fetching product" });
  }
};



export async function updateProduct(req, res) {
    try {
        const id = req.params.id;
        const { product_name, price, description, category } = req.body;

        const updateData = { product_name, price, description, category };

        // Handle image if uploaded
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedProduct = await products.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedProduct) {
            return res.json({
                success: false,
                message: "Invalid product ID"
            });
        }

        return res.json({
            success: true,
            message: "Product successfully updated",
            product: updatedProduct
        });
    } catch (err) {
        console.error(err);
       
        
    }
}



// / ***************************!!!!!!!!!!!!!!!!!****************************!!!!!!!!!!!!!!!!!!!!!!!!***************!!!!!!!!!!!!!!!!!!!!!



export async function getAllOrders(req,res){
    try{
        const allOrders =await orders.find().populate("user_id","username email",'')
        .populate({path:"items.product_id",model:"products"})
        .sort({createdAt:-1})
        res.json(allOrders)
    }
    catch(err){
        console.log(err);
        res.json({message:"cant find orders"})
        
    }
}


export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await orders.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "error updating order" });
  }
}
