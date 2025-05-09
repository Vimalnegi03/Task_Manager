import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const connectToDb=async()=>{
    try {
        console.log(process.env.MONGO_URL);
        
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connection successful");
        
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

export default connectToDb;