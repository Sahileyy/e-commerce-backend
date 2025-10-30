import express from 'express'
import bodyParser from 'body-parser';
import { connectDB } from './dataBase/dbConnect.js';
import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import publicRouter from './routes/publicRoutes.js';
import session from 'express-session';
import MongoStore from 'connect-mongo'
const DATABASE_URI ="mongodb://127.0.0.1:27017/CosmeticDB"
import cors from 'cors'

const port = 3030;


const app = express()
app.use(cors({
  origin:['http://localhost:5174', 'http://localhost:5173'],
  credentials:true
}))
app.use(
  session({
    secret: "myEcommerce",
    resave: false,
    saveUninitialized: false,
     cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
    store: MongoStore.create({
      mongoUrl: DATABASE_URI,
      collectionName:"sessions",
    })
  })
);
// app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/uploads", express.static("uploads"));

// app.use(bodyParser.urlencoded ({extended:true}))

app.use('/user',userRouter)
app.use('/admin',adminRouter)
app.use('/',publicRouter)

 app.listen(port,()=>{
    console.log(`port :${port} running`);
    
 })