import mongoose from 'mongoose'

export async function connectDB() {
    try{
        await mongoose.connect("mongodb+srv://sahildevxtra_db_user:<db_password>@cluster0.renrcju.mongodb.net/?appName=Cluster0");
          console.log('DB connected');

          
    }
    catch(err){
        console.log(err);

        

    }
}


connectDB()