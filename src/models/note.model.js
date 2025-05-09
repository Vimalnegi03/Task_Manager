import mongoose from 'mongoose'
const noteSchema=new mongoose.Schema({
project:{
    type:Schema.Types.ObjectId,
    ref:"Project",
    required:true
},
createdBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
},
content:{
    type:String,
    required:true
}
},{timestamps:true})

const Note=mongoose.model("Note",noteSchema)
export default Note