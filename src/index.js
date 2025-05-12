import app from "./app.js"

import dotenv from "dotenv"
dotenv.config({
    path: "./.env",
})
import connectToDb from './db/connectDb.js'


const PORT=process.env.PORT || 7000


connectToDb().then(()=>{
app.listen(PORT ,()=>{
    console.log("Server is running")
})

})
.catch((err)=>{
    console.error("Mongo db connection error")
    process.exit(1)
})
