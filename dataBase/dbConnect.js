import mongoose from 'mongoose'

export async function connectDB() {
    try{
        await mongoose.connect("mongodb+srv://sahil:sahil123@cluster0.renrcju.mongodb.net/cosmeticDB");
          console.log('DB connected');
    }
    catch(err){
        console.log(err);
    }
}


connectDB()