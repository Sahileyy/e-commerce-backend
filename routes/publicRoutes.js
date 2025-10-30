import express from 'express'
import { getProductbyCategory, isAuth, logout, productView, viewCategory } from '../controllers/public.js'

const publicRouter = express.Router()

publicRouter.get('/public/product',productView)
publicRouter.get('/public/product/category/:id',getProductbyCategory)
publicRouter.get('/public/category/product',viewCategory)
publicRouter.post('/public/logout',logout)

export default publicRouter