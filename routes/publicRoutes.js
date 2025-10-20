import express from 'express'
import { productView, viewCategory } from '../controllers/public.js'

const publicRouter = express.Router()

publicRouter.get('/public/product',productView)

publicRouter.get('/public/product',viewCategory)

export default publicRouter