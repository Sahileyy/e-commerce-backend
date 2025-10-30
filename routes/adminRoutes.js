import express from 'express'
import { addCategory, adminLoginControl, adminView, deleteCategory, deleteProduct, editUser, getAllOrders, getSingleProductAdmin, updateCategory, updateOrderStatus, updateProduct } from '../controllers/admin.js'
import { productView, viewCategory } from '../controllers/public.js'
import { getSingleCategory } from '../controllers/admin.js'
import { productInsert } from '../controllers/admin.js'

const adminRouter = express.Router()
import multer from 'multer'
import path from 'path'
import  fs  from 'fs'
import { itsAdmin } from '../middlewares/authentication.js'


const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req,file,cb)=> cb(null,uploadDir),
   filename: (req, file, cb) => {
    const name = file.originalname
    cb(null, name);
  },
}) 

const upload = multer({ storage });

// adminlogin
adminRouter.post('/login',adminLoginControl)


adminRouter.get('/adminPannel',adminView)
adminRouter.put('/adminPutUser/:id',editUser)


adminRouter.use(itsAdmin)
// product
adminRouter.post("/product", upload.single("image"), productInsert);
adminRouter.put('/product/:id',upload.single("image"),updateProduct)
adminRouter.delete('/product/:id',deleteProduct)
adminRouter.get('/product',productView)
adminRouter.get('/product/:id',getSingleProductAdmin)




// category

adminRouter.post('/category',addCategory)
adminRouter.get('/category',viewCategory)
adminRouter.get('/category/:id', getSingleCategory);

adminRouter.delete('/category/:id',deleteCategory)
adminRouter.put('/category/:id',updateCategory)

adminRouter.get("/orders", getAllOrders);
adminRouter.put("/order/:orderId", updateOrderStatus);

export default adminRouter