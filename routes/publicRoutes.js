import express from 'express'
import { getProductbyCategory, logout, productView, searchProducts, viewCategory } from '../controllers/public.js'

const publicRouter = express.Router()

publicRouter.get("/public/product/search", searchProducts);
publicRouter.get('/public/product',productView)
publicRouter.get('/public/product/category/:id',getProductbyCategory)
publicRouter.get('/public/category/product',viewCategory)
publicRouter.post('/public/logout',logout)

export default publicRouter