import express from 'express'
import bodyParser from 'body-parser';
import { connectDB } from './dataBase/dbConnect.js';
import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import publicRouter from './routes/publicRoutes.js';
import session from 'express-session';
import MongoStore from 'connect-mongo'
const DATABASE_URI ="mongodb+srv://sahil:sahil123@cluster0.renrcju.mongodb.net/cosmeticDB"
import cors from 'cors'

const port = 3030;


const app = express()
app.use(cors({
  origin:['http://localhost:5174', 'http://localhost:5173','http://13.201.21.101','https://sahilsports.duckdns.org/api'],
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
app.use("/api/uploads", express.static("uploads"));

// app.use(bodyParser.urlencoded ({extended:true}))

app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)
app.use('/api/',publicRouter)

 app.listen(port,()=>{
    console.log(`port :${port} running`);
    
 })