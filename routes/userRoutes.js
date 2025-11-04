import express from "express"
import { registerUser } from "../controllers/register.js"
import {  loginControl } from "../controllers/admin.js"
import { createCart, CreateOrder, deleteCart, deleteOrderById, getCartCount, getOrderById,  getSingleProduct,  getUserOrders,  updateCart, updateOrder, viewCart } from "../controllers/uersControl.js"
import { itsUser } from "../middlewares/authentication.js"

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginControl)

// bug

userRouter.use(itsUser)
userRouter.use(express.json());
userRouter.use(express.urlencoded({ extended: true }));

// /user/cart/add/ use it like this in post man
userRouter.get("/cart/view",viewCart);
userRouter.post('/cart/add', createCart)
userRouter.get("/cart/count", getCartCount);
userRouter.put('/cart/update/:id',updateCart)
userRouter.delete('/cart/delete/:id',deleteCart)

userRouter.post('/order',CreateOrder)
userRouter.put('/order/:id',updateOrder)
userRouter.get('/order/:id',getOrderById)
userRouter.get("/myorder", getUserOrders);
userRouter.delete('/order/:id',deleteOrderById)
userRouter.get('/product/:id', getSingleProduct);







export default userRouter

