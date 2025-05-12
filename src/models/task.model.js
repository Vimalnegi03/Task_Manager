import mongoose from 'mongoose'

import {TaskStatusEnum,AvailableTaskStatuses} from '../utils/constants.js'
const taskSchema=new mongoose.Schema({
title:{
    type:String,
    required:true,
    trim:true
},
description:{
    type:String,
    required:true,
},
project:{
    type:Schema.Types.ObjectId,
    ref:"Project",
    required:true
},
assignedTo:{
    type:Schema.Types.ObjectId,
    ref:"User"
},
assignedBy:{
    type:Schema.Types.ObjectId,
    ref:"User"
},
status:{
    type:String,
    enum:AvailableTaskStatuses,
    default:TaskStatusEnum.TODO
},
attachments:{
    type:[
        {
            url:String,
            mimetye:String,
            size:Number
        }
    ],
    default:[]
}
},{timestamps:true})

const Task=mongoose.model("Task",taskSchema)
export default Task