import express, { urlencoded } from 'express'
import dotenv from "dotenv"
dotenv.config({
    path: "./.env",
})
import connectToDb from './db/connectDb.js'
import cookieParser from 'cookie-parser'
import app from "./app.js"

const PORT=process.env.PORT || 7000
app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())

connectToDb().then(()=>{
app.listen(PORT ,()=>{
    console.log("Server is running")
})

})
.catch((err)=>{
    console.error("Mongo db connection error")
    process.exit(1)
})
