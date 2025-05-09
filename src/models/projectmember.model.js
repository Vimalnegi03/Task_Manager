import mongoose from 'mongoose'
import { UserAvailableRoles,UserRoleEnums } from '../utils/constants'
const projectmemberSchema=new mongoose.Schema({
user:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
},
project:{
    type:Schema.Types.ObjectId,
    ref:"Project",
    required:true
},
role:{
  type:String,
  enum:UserAvailableRoles,
  default:UserRoleEnums.MEMBER
}
},{timestamps:true})

const ProjectMember=mongoose.model("ProjectMember",projectmemberSchema)
export default ProjectMember