import express from "express"
import { registerUser } from "../controllers/register.js"
import {  loginControl } from "../controllers/admin.js"
import { createCart, CreateOrder, deleteCart, deleteOrderById, getOrderById, updateCart, updateOrder } from "../controllers/uersControl.js"
import { itsUser } from "../middlewares/authentication.js"
const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginControl)

// bug

userRouter.use(itsUser)
userRouter.use(express.json());
userRouter.use(express.urlencoded({ extended: true }));

// /user/cart/add/ use it like this in post man

userRouter.post('/cart/add', createCart)
userRouter.put('/cart/update/:id',updateCart)
userRouter.delete('/cart/delete/:id',deleteCart)

userRouter.post('/order',CreateOrder)
userRouter.put('/order/:id',updateOrder)
userRouter.get('/order/:id',getOrderById)
userRouter.delete('/order/:id',deleteOrderById)








export default userRouter

