import mongoose from 'mongoose'
import {Schema} from 'mongoose'
const projectSchema=new mongoose.Schema({
 name:{
    type:String,
    required:true,
    unique:true,
    trim:true
 },
 description:{
    type:String
 },
 createdBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
 }

},{timestamps:true})

const Project=mongoose.model("Project",projectSchema)
export default Project