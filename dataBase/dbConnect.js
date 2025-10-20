import mongoose from 'mongoose'

export async function connectDB() {
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/CosmeticDB")
          console.log('DB connected');

          
    }
    catch(err){
        console.log(err);

        

    }
}


connectDB()